import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  
  const vars = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('[data-framer-name="Meet the Couple Heading"]'));
    const visible = headings.find(h => h.offsetParent !== null) || headings[0];
    const p = visible.querySelector('p');
    let curr = p;
    const chain = [];
    while (curr && curr !== document.documentElement) {
      const cs = window.getComputedStyle(curr);
      chain.push({
        tag: curr.tagName,
        cls: curr.className.toString().slice(0, 50),
        lineHeightVar: cs.getPropertyValue('--framer-line-height'),
        rawLineHeight: cs.lineHeight
      });
      curr = curr.parentElement;
    }
    return chain;
  });
  console.log(JSON.stringify(vars, null, 2));
  await browser.close();
})();
