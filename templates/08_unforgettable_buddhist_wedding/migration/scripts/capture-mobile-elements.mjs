import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });

  // 1. Mobile Meet the Couple
  const meetEl = await page.evaluateHandle(() => {
    const ps = Array.from(document.querySelectorAll('p')).filter(p => p.textContent.includes('Meet the'));
    const visible = ps.find(p => p.offsetParent !== null) || ps[0];
    return visible ? visible.parentElement : null;
  });
  if (meetEl) {
    await meetEl.asElement().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await meetEl.asElement().screenshot({
      path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/mobile_meet_couple.png'
    });
    console.log('Saved mobile_meet_couple.png');
  }

  // 2. Mobile Almost time to celebrate
  const almostEl = await page.evaluateHandle(() => {
    const ps = Array.from(document.querySelectorAll('p')).filter(p => p.textContent.includes('Almost time'));
    const visible = ps.find(p => p.offsetParent !== null) || ps[0];
    return visible ? visible.parentElement : null;
  });
  if (almostEl) {
    await almostEl.asElement().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await almostEl.asElement().screenshot({
      path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/mobile_almost_time.png'
    });
    console.log('Saved mobile_almost_time.png');
  }

  // 3. Mobile Our families are excited
  const familyEl = await page.evaluateHandle(() => {
    const ps = Array.from(document.querySelectorAll('p')).filter(p => p.textContent.includes('Our families are excited'));
    const visible = ps.find(p => p.offsetParent !== null) || ps[0];
    return visible ? visible.parentElement : null;
  });
  if (familyEl) {
    await familyEl.asElement().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await familyEl.asElement().screenshot({
      path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/mobile_families_excited.png'
    });
    console.log('Saved mobile_families_excited.png');
  }

  await browser.close();
})();
