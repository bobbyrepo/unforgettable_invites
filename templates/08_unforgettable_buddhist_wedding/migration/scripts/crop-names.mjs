import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  
  // Hero crop
  await page.screenshot({
    path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/hero_names_crop.png',
    clip: { x: 300, y: 150, width: 840, height: 600 }
  });

  // Section 2 scroll down
  await page.evaluate(() => window.scrollTo(0, 1100));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/section2_names_crop.png',
    clip: { x: 300, y: 0, width: 840, height: 800 }
  });

  await browser.close();
  console.log('CROPS_SAVED');
})();
