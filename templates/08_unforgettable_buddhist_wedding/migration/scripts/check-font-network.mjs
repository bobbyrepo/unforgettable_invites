import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const fontRequests = [];
  page.on('response', res => {
    if (res.url().includes('woff2') || res.url().includes('font')) {
      fontRequests.push({ url: res.url().split('/').pop(), status: res.status() });
    }
  });

  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  
  console.log('Font responses:', fontRequests);
  await browser.close();
})();
