import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });

  const html = await page.evaluate(() => {
    const ps = Array.from(document.querySelectorAll('p')).filter(p => p.textContent.includes('Our families are excited'));
    const target = ps.find(p => p.getBoundingClientRect().height > 0);
    return {
      count: ps.length,
      targetHtml: target ? target.parentElement.outerHTML : 'none',
      boundingRect: target ? target.getBoundingClientRect() : null
    };
  });
  console.log(JSON.stringify(html, null, 2));
  await browser.close();
})();
