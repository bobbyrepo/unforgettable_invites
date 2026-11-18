import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/live_verification_now.png' });
  await browser.close();
  console.log('SCREENSHOT_DONE');
})();
