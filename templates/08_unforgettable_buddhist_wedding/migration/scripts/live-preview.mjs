import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true
});

try {
  // Desktop View
  const pageDesk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageDesk.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle' });
  await pageDesk.waitForTimeout(1000);
  await pageDesk.screenshot({ path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/live_desktop_hero.png' });
  
  // Scroll down to timeline
  await pageDesk.evaluate(() => window.scrollTo(0, 3200));
  await pageDesk.waitForTimeout(1000);
  await pageDesk.screenshot({ path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/live_desktop_timeline.png' });

  // Mobile View
  const pageMob = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await pageMob.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle' });
  await pageMob.waitForTimeout(1000);
  await pageMob.screenshot({ path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/live_mobile_hero.png' });

  console.log('CAPTURED_SUCCESSFULLY');
} finally {
  await browser.close();
}
