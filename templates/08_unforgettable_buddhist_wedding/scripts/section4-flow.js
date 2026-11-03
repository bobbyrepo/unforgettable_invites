/**
 * Section 4 Sequential Flow Controller
 * 
 * Organizes Location Map -> Countdown Block -> Buddha Backdrop sequentially:
 * 1. Location Map (Leaflet map + venue info + location buttons)
 * 2. Countdown Block ("The countdown begins", family intro, star divider, live timer)
 *    placed directly after the map buttons with natural ~45px-50px gap.
 * 3. Buddha Backdrop placed directly after the countdown, offset by -100px
 *    (mobile: -30px) so the halo begins gracefully right below the timer digits.
 */
(function initSection4Flow() {
  function adjustFlow() {
    console.log('[section4-flow] adjustFlow called');
    const candidates = [
      { el: document.querySelector('.framer-12tiy0u'), mode: 'desktop' },
      { el: document.querySelector('.framer-1hm5mtp'), mode: 'tablet' },
      { el: document.querySelector('.framer-98eqjf'), mode: 'mobile' }
    ];

    const active = candidates.find(c => c.el && c.el.getBoundingClientRect().width > 50);
    if (!active) {
      console.log('[section4-flow] No active candidate found');
      return;
    }
    console.log('[section4-flow] Active mode:', active.mode, 'width:', active.el.getBoundingClientRect().width);

    const section = active.el;
    const mode = active.mode;
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top + window.scrollY;

    // Find the Location Map container
    const mapEl = section.querySelector('[data-framer-name="Location Map"]');
    if (!mapEl) return;

    // Find the lowest visual point of the map or any of its buttons
    let mapBottom = mapEl.getBoundingClientRect().bottom + window.scrollY;
    const descendants = mapEl.querySelectorAll('*');
    for (let i = 0; i < descendants.length; i++) {
      const b = descendants[i].getBoundingClientRect().bottom + window.scrollY;
      if (b > mapBottom) mapBottom = b;
    }

    const mapBottomRel = mapBottom - sectionTop;
    const mapToCountdownGap = (mode === 'mobile') ? 52 : (mode === 'tablet') ? 68 : 95;
    const countdownTop = Math.round(mapBottomRel + mapToCountdownGap);

    let countdownBottomRel = countdownTop;

    if (mode === 'desktop') {
      const countdown = section.querySelector('[data-framer-name="Countdown"]');
      if (countdown) {
        // Find Heading inside countdown to calculate exact gap
        const heading = countdown.querySelector('[data-framer-name="Countdown Heading"]');
        const intro = countdown.querySelector('[data-framer-name="Countdown Intro Text"]');
        const divider = countdown.querySelector('[data-framer-name="Countdown Divider"]');
        const timer = countdown.querySelector('[data-framer-name="Countdown Timer"]');

        countdown.style.setProperty('top', countdownTop + 'px', 'important');
        countdown.style.setProperty('opacity', '1', 'important');
        countdown.style.setProperty('visibility', 'visible', 'important');

        // Reveal all descendants (Framer scroll animations set inline opacity: 0)
        countdown.querySelectorAll('*').forEach(c => {
          c.style.setProperty('opacity', '1', 'important');
          c.style.setProperty('visibility', 'visible', 'important');
        });

        if (timer) {
          const tRect = timer.getBoundingClientRect();
          if (tRect.height > 0) {
            countdownBottomRel = (tRect.bottom + window.scrollY) - sectionTop;
          } else {
            countdownBottomRel = countdownTop + 340;
          }
        } else {
          countdownBottomRel = countdownTop + 340;
        }
      }
    } else {
      // Tablet or Mobile
      const heading = section.querySelector('[data-framer-name="Countdown Heading"]');
      const intro = section.querySelector('[data-framer-name="Countdown Intro Text"]');
      const divider = section.querySelector('[data-framer-name="Countdown Divider"]');
      const timer = section.querySelector('[data-framer-name="Countdown Timer"]');

      const hSpacing = (mode === 'mobile') ? 34 : 44;
      const dSpacing = (mode === 'mobile') ? 78 : 94;
      const tSpacing = (mode === 'mobile') ? 104 : 124;

      const elements = [heading, intro, divider, timer];
      elements.forEach(el => {
        if (el) {
          el.style.setProperty('opacity', '1', 'important');
          el.style.setProperty('visibility', 'visible', 'important');
        }
      });

      if (heading) heading.style.setProperty('top', countdownTop + 'px', 'important');
      if (intro) intro.style.setProperty('top', (countdownTop + hSpacing) + 'px', 'important');
      if (divider) divider.style.setProperty('top', (countdownTop + dSpacing) + 'px', 'important');
      if (timer) {
        timer.style.setProperty('top', (countdownTop + tSpacing) + 'px', 'important');
        const tRect = timer.getBoundingClientRect();
        countdownBottomRel = countdownTop + tSpacing + (tRect.height || 50);
      }
    }

    // Buddha Backdrop: offset from countdown bottom
    // Desktop: -200px (halo begins gracefully ~60px below timer digits)
    // Tablet: -140px (halo begins gracefully ~50px below timer digits)
    // Mobile: 0px (preserves full halo visibility with ~50px sky clearance under timer)
    const buddhaOffset = (mode === 'desktop') ? -200 : (mode === 'tablet') ? -140 : 0;
    const buddhaTop = Math.round(countdownBottomRel + buddhaOffset);

    const buddha = section.querySelector('[data-framer-name="Countdown Backdrop"]');
    if (buddha) {
      buddha.style.setProperty('top', buddhaTop + 'px', 'important');
      buddha.style.setProperty('opacity', '1', 'important');
      buddha.style.setProperty('visibility', 'visible', 'important');
    }
  }

  // Run on initial load, DOM updates, and resize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      adjustFlow();
      setTimeout(adjustFlow, 500);
      setTimeout(adjustFlow, 1500);
    });
  } else {
    adjustFlow();
    setTimeout(adjustFlow, 500);
    setTimeout(adjustFlow, 1500);
  }

  window.addEventListener('load', () => {
    adjustFlow();
    setTimeout(adjustFlow, 800);
  });

  window.addEventListener('resize', () => {
    adjustFlow();
  });

  // Watch for map rendering / tab clicks
  const observer = new MutationObserver(() => {
    adjustFlow();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const map = document.querySelector('[data-framer-name="Location Map"]');
    if (map) {
      observer.observe(map, { childList: true, subtree: true, attributes: true });
    }
  });
})();
