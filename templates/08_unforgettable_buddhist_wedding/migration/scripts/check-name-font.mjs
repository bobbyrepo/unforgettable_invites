import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  
  const heroMaya = await page.evaluate(() => {
    const el = document.querySelector('[data-framer-name*="Hero Title — Maya"] p') ||
               document.querySelector('[data-framer-name*="Bride Name"] p') ||
               document.querySelector('[data-framer-name*="Maya"] p');
    if (!el) return null;
    const computed = window.getComputedStyle(el);
    return {
      text: el.textContent,
      innerHTML: el.innerHTML,
      fontWeight: computed.fontWeight,
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      className: el.className
    };
  });

  const heroSiddharth = await page.evaluate(() => {
    const el = document.querySelector('[data-framer-name*="Hero Title — Siddharth"] p') ||
               document.querySelector('[data-framer-name*="Groom Name"] p');
    if (!el) return null;
    const computed = window.getComputedStyle(el);
    return {
      text: el.textContent,
      innerHTML: el.innerHTML,
      fontWeight: computed.fontWeight,
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      className: el.className
    };
  });

  console.log('Hero Maya computed:', heroMaya);
  console.log('Hero Siddharth computed:', heroSiddharth);
  await browser.close();
})();
