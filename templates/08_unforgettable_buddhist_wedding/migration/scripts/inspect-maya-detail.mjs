import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    const el = document.querySelector('[data-framer-name*="Hero Title — Maya"] p') ||
               document.querySelector('[data-framer-name*="Bride Name"] p');
    if (!el) return null;
    const computed = window.getComputedStyle(el);
    
    // Check matched rules
    return {
      text: el.textContent,
      fontFamily: computed.fontFamily,
      fontWeight: computed.fontWeight,
      fontSize: computed.fontSize,
      fontStyle: computed.fontStyle,
      color: computed.color,
      webkitTextStroke: computed.webkitTextStroke,
      inlineStyle: el.getAttribute('style'),
      className: el.className,
      parentClassName: el.parentElement.className
    };
  });

  console.log('Detailed Maya element info:', info);
  await browser.close();
})();
