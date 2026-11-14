const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
    { name: '393', width: 393, height: 852 },
    { name: '810', width: 810, height: 1080 },
    { name: '1536', width: 1536, height: 864 }
];

const TARGET_URL = 'http://localhost:5050/templates/08_unforgettable_buddhist_wedding/index.html';
const OUTPUT_DIR = path.resolve(__dirname, '../src/components/templates/Template09_BuddhaReact/data/settled');

async function extractViewport(browser, vp) {
    console.log(`\n======================================================`);
    console.log(`[EXTRACT] Starting extraction for Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`======================================================`);

    const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1
    });

    const page = await context.newPage();

    // 1. Navigate to T08
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`[EXTRACT] Page loaded, waiting for initial fonts...`);
    await page.evaluate(() => document.fonts.ready);

    // 2. Smooth scroll-through to trigger all enter-view animations
    console.log(`[EXTRACT] Executing scroll-through sequence...`);
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    const step = 350;
    for (let y = 0; y < totalHeight; y += step) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(60);
    }
    // Reach absolute bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);

    // 3. Scroll back to top and let all animations settle
    console.log(`[EXTRACT] Scrolling back to top (scrollY = 0) and settling animations...`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);

    // 4. Extract data
    const extractedData = await page.evaluate(() => {
        const results = {
            viewport: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                scrollHeight: document.body.scrollHeight
            },
            elements: []
        };

        // Gather all named elements and major scenic layers
        const namedElements = Array.from(document.querySelectorAll('[data-framer-name]'));
        const images = Array.from(document.querySelectorAll('img'));
        
        const candidates = new Set([...namedElements, ...images]);

        candidates.forEach(el => {
            const cs = window.getComputedStyle(el);
            const r = el.getBoundingClientRect();

            // Filter out invisible variants: display none, visibility hidden, 0 width/height
            if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0 || r.height === 0) {
                return;
            }

            const framerName = el.getAttribute('data-framer-name') || '';
            const tagName = el.tagName.toLowerCase();
            const textContent = (el.childElementCount === 0 && el.textContent) ? el.textContent.trim() : '';
            const src = (tagName === 'img' && el.src) ? el.src : '';

            // Clean transform matrix if any
            results.elements.push({
                framerName,
                tagName,
                textContent: textContent.slice(0, 80),
                src: src ? src.replace(/.*\/templates\//, '/templates/') : '',
                className: el.className ? String(el.className).slice(0, 100) : '',
                rect: {
                    x: Math.round(r.x * 100) / 100,
                    y: Math.round(r.y * 100) / 100,
                    width: Math.round(r.width * 100) / 100,
                    height: Math.round(r.height * 100) / 100
                },
                styles: {
                    position: cs.position,
                    top: cs.top,
                    left: cs.left,
                    right: cs.right,
                    bottom: cs.bottom,
                    transform: cs.transform,
                    opacity: cs.opacity,
                    zIndex: cs.zIndex,
                    fontFamily: cs.fontFamily,
                    fontSize: cs.fontSize,
                    fontWeight: cs.fontWeight,
                    lineHeight: cs.lineHeight,
                    color: cs.color,
                    letterSpacing: cs.letterSpacing,
                    textAlign: cs.textAlign,
                    aspectRatio: cs.aspectRatio
                }
            });
        });

        return results;
    });

    console.log(`[EXTRACT] Extracted ${extractedData.elements.length} visible elements for ${vp.name}px`);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const outPath = path.join(OUTPUT_DIR, `${vp.name}.json`);
    fs.writeFileSync(outPath, JSON.stringify(extractedData, null, 2), 'utf-8');
    console.log(`[EXTRACT] Saved settled coordinates to: ${outPath}`);

    await context.close();
    return extractedData;
}

async function run() {
    console.log(`[EXTRACT] Launching Edge browser via Playwright...`);
    const browser = await chromium.launch({ channel: 'msedge', headless: true });

    try {
        for (const vp of VIEWPORTS) {
            await extractViewport(browser, vp);
        }
        console.log(`\n[EXTRACT] ALL VIEWPORTS EXTRACTED SUCCESSFULLY!`);
    } finally {
        await browser.close();
    }
}

run().catch(err => {
    console.error(`[EXTRACT] Error during extraction:`, err);
    process.exit(1);
});
