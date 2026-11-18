import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });

  const results = await page.evaluate(() => {
    // 1. Meet the Couple
    const meetCouple = Array.from(document.querySelectorAll('[data-framer-name="Meet the Couple Heading"]'))
      .filter(el => el.offsetParent !== null)
      .map(el => Array.from(el.querySelectorAll('p')).map(p => ({
        text: p.textContent.trim(),
        y: p.getBoundingClientRect().y,
        height: p.getBoundingClientRect().height,
        lh: window.getComputedStyle(p).lineHeight,
        fs: window.getComputedStyle(p).fontSize
      })));

    // 2. Almost time to celebrate
    const celebrate = Array.from(document.querySelectorAll('p'))
      .filter(p => p.textContent.includes('Almost time') || p.textContent.includes('celebrate'))
      .filter(p => p.offsetParent !== null)
      .map(p => ({
        text: p.textContent.trim(),
        y: p.getBoundingClientRect().y,
        height: p.getBoundingClientRect().height,
        lh: window.getComputedStyle(p).lineHeight,
        fs: window.getComputedStyle(p).fontSize
      }));

    // 3. Our families are excited
    const family = Array.from(document.querySelectorAll('p'))
      .filter(p => p.textContent.includes('Our families are excited') || p.textContent.includes('happiest days'))
      .filter(p => p.offsetParent !== null)
      .map(p => ({
        text: p.textContent.trim(),
        y: p.getBoundingClientRect().y,
        height: p.getBoundingClientRect().height,
        lh: window.getComputedStyle(p).lineHeight,
        fs: window.getComputedStyle(p).fontSize
      }));

    return { meetCouple, celebrate, family };
  });

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
