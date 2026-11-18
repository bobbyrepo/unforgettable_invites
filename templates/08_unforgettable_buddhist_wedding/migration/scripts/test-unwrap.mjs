import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:3000/templates/08_unforgettable_buddhist_wedding/index.html', { waitUntil: 'networkidle' });
  
  console.log('Console errors on baseline:', consoleErrors);
  
  // Now let's test unwrapping one wrapper dynamically in the page to test layout and console
  const result = await page.evaluate(() => {
    const wrapper = document.querySelector('[data-framer-background-image-wrapper="true"]');
    if (!wrapper) return { found: false };
    const parent = wrapper.parentElement;
    const img = wrapper.querySelector('img');
    const oldRect = img.getBoundingClientRect();
    
    // Test styling img directly
    img.className = 'bg-img';
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.right = '0';
    img.style.bottom = '0';
    img.style.left = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    parent.insertBefore(img, wrapper);
    wrapper.remove();
    
    const newRect = img.getBoundingClientRect();
    return {
      found: true,
      oldRect: { x: oldRect.x, y: oldRect.y, width: oldRect.width, height: oldRect.height },
      newRect: { x: newRect.x, y: newRect.y, width: newRect.width, height: newRect.height }
    };
  });
  
  console.log('Test unwrap evaluation:', result);
  await browser.close();
})();
