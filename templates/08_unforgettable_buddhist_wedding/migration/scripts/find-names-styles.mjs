import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  
  const elements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const matches = [];
    all.forEach(el => {
      // direct text
      const directText = Array.from(el.childNodes)
        .filter(n => n.nodeType === 3)
        .map(n => n.nodeValue.trim())
        .join(' ');
      if (directText.includes('Nikita') || directText.includes('Sarvesh') || directText.includes('Bhagat') || directText.includes('Wanjari')) {
        const computed = window.getComputedStyle(el);
        matches.push({
          tag: el.tagName,
          text: directText,
          parentFramerName: el.closest('[data-framer-name]')?.getAttribute('data-framer-name'),
          fontFamily: computed.fontFamily,
          fontWeight: computed.fontWeight,
          fontSize: computed.fontSize,
          className: el.className
        });
      }
    });
    return matches;
  });

  console.log('All matching name elements on page:', JSON.stringify(elements, null, 2));
  await browser.close();
})();
