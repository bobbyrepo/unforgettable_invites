import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });

  // 1. Screenshot Meet the Couple
  await page.evaluate(() => {
    const el = document.querySelector('[data-framer-name="Meet the Couple Heading"]');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/verify_meet_couple.png'
  });

  // 2. Screenshot Almost time to celebrate
  await page.evaluate(() => {
    const ps = Array.from(document.querySelectorAll('p')).filter(p => p.textContent.includes('Almost time'));
    const visible = ps.find(p => p.offsetParent !== null) || ps[0];
    if (visible) visible.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/verify_almost_time.png'
  });

  // 3. Screenshot Our families are excited
  await page.evaluate(() => {
    const ps = Array.from(document.querySelectorAll('p')).filter(p => p.textContent.includes('Our families are excited'));
    const visible = ps.find(p => p.offsetParent !== null) || ps[0];
    if (visible) visible.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/verify_families_excited.png'
  });

  console.log('Screenshots captured successfully!');
  await browser.close();
})();
