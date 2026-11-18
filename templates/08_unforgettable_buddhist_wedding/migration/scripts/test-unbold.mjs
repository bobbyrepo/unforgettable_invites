import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });

  // Check with font-synthesis: none and font-weight: normal / 300 / 400
  const before = await page.evaluate(() => {
    const el = document.querySelector('[data-framer-name*="Hero Title — Maya"] p');
    return {
      fontFamily: window.getComputedStyle(el).fontFamily,
      fontWeight: window.getComputedStyle(el).fontWeight
    };
  });
  console.log('Before override:', before);

  // Apply font-synthesis: none, font-weight: 300, -webkit-font-smoothing
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.id = 'unbold-names-test';
    style.textContent = `
      [data-framer-name*="Hero Title — Maya"] p,
      [data-framer-name*="Hero Title — Siddharth"] p,
      [data-framer-name*="Bride Name"] p,
      [data-framer-name*="Groom Name"] p,
      .tp-miofarin-86-18,
      .tp-miofarin-65-19,
      .tp-miofarin-75-31,
      .tp-miofarin-67-32,
      .tp-miofarin-140-61,
      .tp-miofarin-171-62,
      .tp-miofarin-129-68,
      .tp-miofarin-151-70 {
        font-family: "Miofarin Regular", sans-serif !important;
        font-weight: 300 !important;
        font-synthesis: none !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }
    `;
    document.head.appendChild(style);
  });

  // Capture hero crop with the regular weight
  await page.screenshot({
    path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/names_unbolded_hero.png',
    clip: { x: 300, y: 150, width: 840, height: 600 }
  });

  // Capture section 2 card crop
  await page.evaluate(() => window.scrollTo(0, 1100));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/names_unbolded_section2.png',
    clip: { x: 350, y: 50, width: 740, height: 650 }
  });

  await browser.close();
  console.log('UNBOLD_TEST_CAPTURED');
})();
