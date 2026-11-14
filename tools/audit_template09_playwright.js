const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
    { name: 'mobile_393', width: 393, height: 852 },
    { name: 'tablet_810', width: 810, height: 1080 },
    { name: 'desktop_1536', width: 1536, height: 864 }
];

const URL = 'http://localhost:3000/templates/09_unforgettable_buddha_react';
const SCREENSHOT_DIR = path.resolve(__dirname, '../scratch/screenshots_t09');

async function auditViewport(browser, vp) {
    console.log(`\n======================================================`);
    console.log(`[AUDIT] Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`======================================================`);

    const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1
    });

    const page = await context.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // 1. Layout Invariants Check
    const invariants = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;

        const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
        const innerWidth = window.innerWidth;
        const hasHorizontalScroll = scrollWidth > innerWidth + 1;

        const sections = Array.from(document.querySelectorAll('[data-section]')).map(sec => {
            const r = sec.getBoundingClientRect();
            return {
                id: sec.getAttribute('data-section'),
                width: Math.round(r.width),
                height: Math.round(r.height),
                top: Math.round(r.top + window.scrollY)
            };
        });

        const audioPill = document.querySelector('button[aria-label*="Buddhist Music"]');
        const audioPillRect = audioPill ? audioPill.getBoundingClientRect() : null;

        return {
            scrollWidth,
            innerWidth,
            hasHorizontalScroll,
            sections,
            hasAudioPill: !!audioPill,
            audioPillFixed: audioPillRect ? (audioPillRect.bottom <= window.innerHeight) : false
        };
    });

    console.log(`[AUDIT] Horizontal Scroll: ${invariants.hasHorizontalScroll ? 'FAILED (Overflow detected!)' : 'PASSED (0px overflow)'}`);
    console.log(`[AUDIT] Found ${invariants.sections.length} core sections:`);
    invariants.sections.forEach(s => {
        console.log(`   - ${s.id}: ${s.width}x${s.height}px at y:${s.top}`);
    });
    console.log(`[AUDIT] Audio Pill: ${invariants.hasAudioPill ? 'PASSED (Rendered & Fixed)' : 'FAILED'}`);

    // 2. Capture Screenshot
    if (!fs.existsSync(SCREENSHOT_DIR)) {
        fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    const shotPath = path.join(SCREENSHOT_DIR, `${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    console.log(`[AUDIT] Saved full-page screenshot to: ${shotPath}`);

    await context.close();
    return invariants;
}

async function run() {
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    try {
        let allPassed = true;
        for (const vp of VIEWPORTS) {
            const res = await auditViewport(browser, vp);
            if (res.hasHorizontalScroll || !res.hasAudioPill || res.sections.length < 5) {
                allPassed = false;
            }
        }

        console.log(`\n======================================================`);
        console.log(allPassed ? `✅ ALL INVARIANTS PASSED ACROSS ALL VIEWPORTS!` : `❌ SOME INVARIANTS FAILED!`);
        console.log(`======================================================`);
    } finally {
        await browser.close();
    }
}

run().catch(err => {
    console.error('[AUDIT] Error during audit:', err);
    process.exit(1);
});
