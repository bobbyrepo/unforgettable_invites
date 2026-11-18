import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  
  // Desktop
  const pageDesk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageDesk.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  await pageDesk.screenshot({ path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/option2_desktop_hero.png' });
  
  // Scroll down to cards
  await pageDesk.evaluate(() => window.scrollTo(0, 1500));
  await new Promise(r => setTimeout(r, 600));
  await pageDesk.screenshot({ path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/option2_desktop_cards.png' });
  
  // Mobile
  const pageMob = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await pageMob.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  await pageMob.screenshot({ path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/option2_mobile_hero.png' });
  
  await pageMob.evaluate(() => window.scrollTo(0, 1200));
  await new Promise(r => setTimeout(r, 600));
  await pageMob.screenshot({ path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/option2_mobile_cards.png' });

  await browser.close();
  console.log('ALL_CAPTURES_COMPLETED');
})();
