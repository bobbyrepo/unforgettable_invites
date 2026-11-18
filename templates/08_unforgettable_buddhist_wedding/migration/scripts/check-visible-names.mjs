import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  
  const visible = await page.evaluate(() => {
    const ps = Array.from(document.querySelectorAll('p, div, span, h1, h2, h3'));
    return ps.filter(el => {
      const text = el.textContent.trim();
      if ((text === 'Nikita' || text === 'Sarvesh') && el.offsetParent !== null) {
        return true;
      }
      return false;
    }).map(el => {
      const c = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        text: el.textContent.trim(),
        className: el.className,
        parentClass: el.parentElement?.className,
        grandparentClass: el.parentElement?.parentElement?.className,
        fontFamily: c.fontFamily,
        fontWeight: c.fontWeight,
        fontSize: c.fontSize,
        color: c.color,
        fontStyle: c.fontStyle
      };
    });
  });

  console.log('VISIBLE elements for Nikita / Sarvesh:', JSON.stringify(visible, null, 2));
  await browser.close();
})();
