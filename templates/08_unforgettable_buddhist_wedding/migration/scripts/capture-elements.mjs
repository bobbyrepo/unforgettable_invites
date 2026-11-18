import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });

  // 1. Element screenshot: Meet the Couple
  const meetEl = await page.$('[data-framer-name="Meet the Couple Heading"]:not([style*="display: none"])');
  if (meetEl) {
    await meetEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await meetEl.screenshot({
      path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/element_meet_couple.png'
    });
    console.log('Saved element_meet_couple.png');
  }

  // 2. Element screenshot: Almost time to celebrate
  const almostEl = await page.evaluateHandle(() => {
    const ps = Array.from(document.querySelectorAll('p')).filter(p => p.textContent.includes('Almost time'));
    const visible = ps.find(p => p.offsetParent !== null) || ps[0];
    return visible ? visible.parentElement : null;
  });
  if (almostEl) {
    await almostEl.asElement().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await almostEl.asElement().screenshot({
      path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/element_almost_time.png'
    });
    console.log('Saved element_almost_time.png');
  }

  // 3. Element screenshot: Our families are excited
  const familyEl = await page.evaluateHandle(() => {
    const ps = Array.from(document.querySelectorAll('p')).filter(p => p.textContent.includes('Our families are excited'));
    const visible = ps.find(p => p.offsetParent !== null) || ps[0];
    return visible ? visible.parentElement : null;
  });
  if (familyEl) {
    await familyEl.asElement().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await familyEl.asElement().screenshot({
      path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/element_families_excited.png'
    });
    console.log('Saved element_families_excited.png');
  }

  await browser.close();
})();
