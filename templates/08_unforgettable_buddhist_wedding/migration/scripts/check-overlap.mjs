import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });

  const meetCouple = await page.evaluate(() => {
    const heading = document.querySelector('[data-framer-name="Meet the Couple Heading"]');
    if (!heading) return null;
    const ps = Array.from(heading.querySelectorAll('p'));
    return ps.map(p => {
      const r = p.getBoundingClientRect();
      const c = window.getComputedStyle(p);
      return {
        text: p.textContent,
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        position: c.position,
        top: c.top,
        lineHeight: c.lineHeight,
        fontSize: c.fontSize,
        display: c.display,
        whiteSpace: c.whiteSpace
      };
    });
  });

  const countdown = await page.evaluate(() => {
    const heading = document.querySelector('[data-framer-name="Countdown Heading"]');
    if (!heading) return null;
    const ps = Array.from(heading.querySelectorAll('p'));
    return ps.map(p => {
      const r = p.getBoundingClientRect();
      const c = window.getComputedStyle(p);
      return {
        text: p.textContent,
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        position: c.position,
        lineHeight: c.lineHeight,
        fontSize: c.fontSize,
        display: c.display
      };
    });
  });

  console.log('Meet Couple ps:', JSON.stringify(meetCouple, null, 2));
  console.log('Countdown ps:', JSON.stringify(countdown, null, 2));
  await browser.close();
})();
