import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });

  // Scroll through page to trigger all scroll animations
  await page.evaluate(async () => {
    // Remove opacity 0 from animated containers so we can see them clearly
    document.querySelectorAll('[style*="opacity:0"]').forEach(el => {
      el.style.opacity = '1';
    });
  });

  const pHandle = await page.evaluateHandle(() => {
    const ps = Array.from(document.querySelectorAll('p')).filter(p => p.textContent.includes('Our families are excited'));
    return ps.find(p => p.getBoundingClientRect().height > 0);
  });

  if (pHandle) {
    const parent = await page.evaluateHandle(el => el.parentElement, pHandle);
    await parent.asElement().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await parent.asElement().screenshot({
      path: 'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/mobile_families_real_visible.png'
    });
    console.log('Saved mobile_families_real_visible.png');
  }

  await browser.close();
})();
