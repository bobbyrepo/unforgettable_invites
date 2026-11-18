import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  
  const sources = await page.evaluate(() => {
    const list = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.cssText && rule.cssText.includes('--framer-line-height')) {
            list.push({
              href: sheet.href,
              selector: rule.selectorText,
              cssText: rule.cssText.slice(0, 200)
            });
          }
        }
      } catch (e) {}
    }
    return list;
  });
  console.log(JSON.stringify(sources, null, 2));
  await browser.close();
})();
