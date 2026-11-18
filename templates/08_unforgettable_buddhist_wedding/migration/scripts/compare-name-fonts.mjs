import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });

  // Scroll to section 2
  await page.evaluate(() => window.scrollTo(0, 1100));
  await new Promise(r => setTimeout(r, 600));

  // 1. Current Miofarin
  await page.screenshot({
    path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/font_opt_current_miofarin.png',
    clip: { x: 350, y: 50, width: 740, height: 650 }
  });

  // 2. IvyOra Display Regular
  await page.evaluate(() => {
    document.querySelectorAll('[data-framer-name*="Bride Name"] p, [data-framer-name*="Groom Name"] p, [data-framer-name*="Hero Title — Maya"] p, [data-framer-name*="Hero Title — Siddharth"] p').forEach(el => {
      el.style.fontFamily = '"IvyOra Display Regular", serif';
      el.style.fontWeight = '400';
    });
  });
  await page.screenshot({
    path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/font_opt_ivyora_regular.png',
    clip: { x: 350, y: 50, width: 740, height: 650 }
  });

  // 3. Brother Signature Regular
  await page.evaluate(() => {
    document.querySelectorAll('[data-framer-name*="Bride Name"] p, [data-framer-name*="Groom Name"] p, [data-framer-name*="Hero Title — Maya"] p, [data-framer-name*="Hero Title — Siddharth"] p').forEach(el => {
      el.style.fontFamily = '"Brother Signature Regular", cursive';
      el.style.fontWeight = '400';
    });
  });
  await page.screenshot({
    path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/font_opt_brother_signature.png',
    clip: { x: 350, y: 50, width: 740, height: 650 }
  });

  await browser.close();
  console.log('COMPARISON_CROPS_SAVED');
})();
