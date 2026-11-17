/**
 * migration/scripts/capture-all.mjs
 * 
 * Spec implementation (Section 7.1):
 * - Common load protocol:
 *     1. fresh context, viewport w x 900, deviceScaleFactor 1
 *     2. addInitScript: wrap console.log/warn/error + window.onerror with performance.now()
 *     3. goto http://localhost:8099/index.html, waitUntil: 'networkidle'
 *     4. scroll journey: y=0 to page bottom in steps of 0.5 * viewport height, 300ms wait; then scrollTo(0,0)
 *     5. wait 8000ms (appear animations + reveals settle)
 *     6. captures:
 *         a) dom-<w>.html (outerHTML normalized: sort attributes by name)
 *         b) styles-<w>.json.gz (all computed properties + hover pass + scrollstate 25%, 50%, 75%)
 *         c) shots (fullPage PNG + viewport clips at 25%, 50%, 75%)
 *         d) network-<w>.txt (ordered requests and response status)
 *         e) console-<w>.txt (timestamped console & errors)
 *         f) coverage-<w>.json (JS executed bytes / total bytes)
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:8099/index.html';

export async function captureViewport({ viewportWidth, outDir, isCanonical = false, interactiveSelectors = [] }) {
    fs.mkdirSync(outDir, { recursive: true });
    const w = viewportWidth;
    console.log(`[capture] Starting capture for viewport ${w}px -> ${outDir}`);

    const browser = await chromium.launch({
        executablePath: CHROME_PATH,
        headless: true
    });

    const context = await browser.newContext({
        viewport: { width: w, height: 900 },
        deviceScaleFactor: 1
    });

    const networkLog = [];
    const consoleLog = [];

    context.on('request', req => {
        networkLog.push({ method: req.method(), url: req.url() });
    });

    context.on('response', res => {
        networkLog.push({ status: res.status(), url: res.url() });
    });

    // 2. addInitScript: timestamp console messages + freeze time & animations for deterministic capture
    await context.addInitScript(() => {
        window.__consoleLog = [];
        ['log', 'warn', 'error', 'info'].forEach(method => {
            const orig = console[method];
            console[method] = function (...args) {
                const ts = performance.now().toFixed(2);
                try {
                    window.__consoleLog.push({ ts, type: method, msg: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
                } catch (e) {}
                orig.apply(console, args);
            };
        });
        window.addEventListener('error', e => {
            const ts = performance.now().toFixed(2);
            window.__consoleLog.push({ ts, type: 'error', msg: `${e.message} at ${e.filename}:${e.lineno}` });
        });

        // Deterministic calibration: freeze Date.now() for countdown timer
        const fixedNow = 1794925000000;
        const OrigDate = window.Date;
        class DeterministicDate extends OrigDate {
            constructor(...args) {
                if (args.length === 0) super(fixedNow);
                else super(...args);
            }
            static now() {
                return fixedNow;
            }
        }
        window.Date = DeterministicDate;
    });

    const page = await context.newPage();

    // Start JS Coverage if canonical
    let cdpSession = null;
    if (isCanonical) {
        try {
            cdpSession = await context.newCDPSession(page);
            await cdpSession.send('Profiler.enable');
            await cdpSession.send('Profiler.startPreciseCoverage', { callCount: true, detailed: true });
            await cdpSession.send('Debugger.enable');
        } catch (e) {
            console.warn('[capture] CDP Coverage warning:', e.message);
        }
    }

    // Hide scrollbars & pause continuous infinite animations for pixel-perfect determinism
    await page.addStyleTag({
        content: `
            *::-webkit-scrollbar { display: none !important; }
            * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
            /* Pause infinite swinging / decorative swaying during static snapshot */
            [style*="rotate"] { animation-play-state: paused !important; }
        `
    });

    // 3. Navigate
    await page.goto(URL, { waitUntil: 'networkidle' });

    // 4. Scroll journey: y=0 to bottom in steps of 0.5 * viewport height, 300ms wait
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = 450;
    for (let y = 0; y < pageHeight; y += step) {
        await page.evaluate(top => window.scrollTo(0, top), y);
        await page.waitForTimeout(300);
    }
    await page.evaluate(() => window.scrollTo(0, 0));

    // 5. Wait 8000ms for animations, reveals & parallax to settle
    await page.waitForTimeout(8000);

    // Save console log
    const clientConsole = await page.evaluate(() => window.__consoleLog || []);
    const consoleText = clientConsole.map(c => `[${c.ts}ms] [${c.type.toUpperCase()}] ${c.msg}`).join('\n');
    fs.writeFileSync(path.join(outDir, `console-${w}.txt`), consoleText, 'utf8');

    // Save network log
    const networkText = networkLog.map(n => n.method ? `REQ: ${n.method} ${n.url}` : `RES: ${n.status} ${n.url}`).join('\n');
    fs.writeFileSync(path.join(outDir, `network-${w}.txt`), networkText, 'utf8');

    // 6a) capture-dom: dump outerHTML with sorted attributes, normalizing intrinsic continuous animation transforms
    const normalizedHtml = await page.evaluate(() => {
        function sortAttrs(node) {
            if (node.nodeType === 1) { // ELEMENT_NODE
                const attrs = Array.from(node.attributes).sort((a, b) => a.name.localeCompare(b.name));
                while (node.attributes.length > 0) {
                    node.removeAttribute(node.attributes[0].name);
                }
                for (const a of attrs) {
                    // Normalize continuous JS-driven physics/sway transforms on hanging bell elements
                    if (a.name === 'style' && (a.value.includes('rotate(') || a.value.includes('translateX(-0.'))) {
                        const normalizedStyle = a.value
                            .replace(/rotate\([^)]+\)/g, 'rotate(0deg)')
                            .replace(/translateX\(-0\.\d+px\)/g, 'translateX(0px)');
                        node.setAttribute(a.name, normalizedStyle);
                    } else {
                        node.setAttribute(a.name, a.value);
                    }
                }
                for (const child of node.childNodes) {
                    sortAttrs(child);
                }
            }
        }
        const clone = document.documentElement.cloneNode(true);
        sortAttrs(clone);
        return clone.outerHTML;
    });
    fs.writeFileSync(path.join(outDir, `dom-${w}.html`), normalizedHtml, 'utf8');

    // 6c) capture-shots: full page screenshot
    await page.screenshot({
        path: path.join(outDir, `shot-${w}-full.png`),
        fullPage: true
    });

    // Viewport-sized clip screenshots at 25%, 50%, 75%
    const offsets = [0.25, 0.50, 0.75];
    const scrollStates = {};

    for (const pct of offsets) {
        const targetY = Math.round(pageHeight * pct);
        await page.evaluate(y => window.scrollTo(0, y), targetY);
        await page.waitForTimeout(400);

        if (isCanonical) {
            await page.screenshot({
                path: path.join(outDir, `shot-${w}-${Math.round(pct * 100)}.png`),
                fullPage: false
            });
        }

        // Collect scroll-state transform/opacity/background-position
        const stateAtOffset = await page.evaluate(() => {
            const result = [];
            const all = document.querySelectorAll('*');
            all.forEach(el => {
                const cs = window.getComputedStyle(el);
                const transform = cs.getPropertyValue('transform');
                const opacity = cs.getPropertyValue('opacity');
                const bgPos = cs.getPropertyValue('background-position');
                if (transform !== 'none' || opacity !== '1') {
                    result.push({
                        tag: el.tagName,
                        framerName: el.getAttribute('data-framer-name'),
                        transform,
                        opacity,
                        bgPos
                    });
                }
            });
            return result;
        });
        scrollStates[`${Math.round(pct * 100)}%`] = stateAtOffset;
    }

    // Save scrollstate
    fs.writeFileSync(
        path.join(outDir, `scrollstate-${w}.json.gz`),
        zlib.gzipSync(Buffer.from(JSON.stringify(scrollStates, null, 2), 'utf8'))
    );

    // Return to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // 6b) capture-styles: collect ALL computed properties for every element
    const stylesData = await page.evaluate(() => {
        function getPath(node) {
            const parts = [];
            let curr = node;
            while (curr && curr !== document.documentElement) {
                const parent = curr.parentNode;
                if (!parent) break;
                const idx = Array.prototype.indexOf.call(parent.childNodes, curr);
                parts.unshift(idx);
                curr = parent;
            }
            return parts.join('/');
        }

        const map = {};
        const all = document.querySelectorAll('*');
        all.forEach(el => {
            const pathKey = getPath(el);
            const cs = window.getComputedStyle(el);
            const rec = {
                tag: el.tagName,
                framerName: el.getAttribute('data-framer-name'),
                framerAppearId: el.getAttribute('data-framer-appear-id'),
                props: {}
            };
            for (let i = 0; i < cs.length; i++) {
                const p = cs.item(i);
                rec.props[p] = cs.getPropertyValue(p);
            }
            map[pathKey] = rec;
        });
        return map;
    });

    // Hover pass for interactive elements
    const hoverData = {};
    for (const sel of interactiveSelectors) {
        try {
            const handle = await page.$(sel);
            if (handle) {
                await page.hover(sel, { timeout: 1000 });
                await page.waitForTimeout(250);
                const subtreeStyles = await page.evaluate(s => {
                    const el = document.querySelector(s);
                    if (!el) return null;
                    const cs = window.getComputedStyle(el);
                    const rec = {};
                    for (let i = 0; i < cs.length; i++) {
                        const p = cs.item(i);
                        rec[p] = cs.getPropertyValue(p);
                    }
                    return rec;
                }, sel);
                if (subtreeStyles) hoverData[sel] = subtreeStyles;
            }
        } catch (e) {
            // Non-fatal if element is not in active breakpoint
        }
    }

    fs.writeFileSync(
        path.join(outDir, `styles-${w}.json.gz`),
        zlib.gzipSync(Buffer.from(JSON.stringify(stylesData, null, 2), 'utf8'))
    );

    fs.writeFileSync(
        path.join(outDir, `hover-${w}.json`),
        JSON.stringify(hoverData, null, 2),
        'utf8'
    );

    // 6f) JS Coverage (canonical only)
    if (isCanonical && cdpSession) {
        try {
            // Perform interaction journey: click audio pill + open switcher
            try {
                await page.click('#buddhist-audio-controller', { timeout: 1500 });
                await page.waitForTimeout(500);
            } catch (e) {}

            const cov = await cdpSession.send('Profiler.takePreciseCoverage');
            await cdpSession.send('Profiler.stopPreciseCoverage');
            await cdpSession.send('Profiler.disable');

            const coverageSummary = cov.result.map(entry => {
                let executedBytes = 0;
                let totalBytes = 0;
                for (const func of entry.functions) {
                    for (const r of func.ranges) {
                        const len = r.endOffset - r.startOffset;
                        totalBytes = Math.max(totalBytes, r.endOffset);
                        if (r.count > 0) executedBytes += len;
                    }
                }
                return {
                    url: entry.url,
                    scriptId: entry.scriptId,
                    totalBytes,
                    executedBytes,
                    isDeadCandidate: executedBytes === 0
                };
            }).filter(e => e.url && !e.url.startsWith('chrome-extension:'));

            fs.writeFileSync(
                path.join(outDir, `coverage-${w}.json`),
                JSON.stringify(coverageSummary, null, 2),
                'utf8'
            );
        } catch (err) {
            console.warn('[capture] Coverage extraction failed:', err.message);
        }
    }

    await context.close();
    await browser.close();
    console.log(`[capture] Finished capture for viewport ${w}px.`);
}
