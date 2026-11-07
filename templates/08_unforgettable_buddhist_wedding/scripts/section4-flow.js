/**
 * Section 4 Sequential Flow Controller
 * 
 * Organizes Location Map -> Countdown Block -> Buddha Backdrop sequentially:
 * 1. Location Map (map + venue info + location buttons)
 * 2. Countdown Block ("The countdown begins", family intro, star divider, live timer)
 *    placed directly after the map buttons with natural gap.
 * 3. Buddha Backdrop placed directly after the countdown, offset gracefully
 *    so the halo begins right below the timer digits.
 * 
 * Deterministic, scroll-independent, and clamped within strict layout boundaries.
 */
(function initSection4Flow() {
  let isAdjusting = false;

  function adjustFlow() {
    if (isAdjusting) return;
    isAdjusting = true;

    try {
      const width = window.innerWidth;
      const mode = width >= 1280 ? 'desktop' : (width >= 768 ? 'tablet' : 'mobile');

      const containerSelector = (mode === 'desktop')
        ? '.framer-12tiy0u'
        : (mode === 'tablet')
          ? '.framer-1hm5mtp'
          : '.framer-98eqjf';

      const section = document.querySelector(containerSelector);
      if (!section) return;

      if (mode === 'desktop') {
        const countdownTop = 1750;
        const buddhaTop = 2120;

        const countdowns = section.querySelectorAll('[data-framer-name="Countdown"]');
        countdowns.forEach(countdown => {
          countdown.style.setProperty('top', countdownTop + 'px', 'important');
          countdown.style.setProperty('opacity', '1', 'important');
          countdown.style.setProperty('visibility', 'visible', 'important');
          countdown.querySelectorAll('*').forEach(c => {
            c.style.setProperty('opacity', '1', 'important');
            c.style.setProperty('visibility', 'visible', 'important');
          });
        });

        const buddhas = section.querySelectorAll('[data-framer-name="Countdown Backdrop"], .framer-qqvm6f');
        buddhas.forEach(buddha => {
          buddha.style.setProperty('top', buddhaTop + 'px', 'important');
          buddha.style.setProperty('opacity', '1', 'important');
          buddha.style.setProperty('visibility', 'visible', 'important');
          buddha.style.setProperty('display', 'block', 'important');
          buddha.style.setProperty('z-index', '5', 'important');
          buddha.querySelectorAll('*').forEach(child => {
            child.style.setProperty('opacity', '1', 'important');
            child.style.setProperty('visibility', 'visible', 'important');
          });
        });
      } else if (mode === 'tablet') {
        const countdownTop = 1220;
        const buddhaTop = 1360;

        const headings = section.querySelectorAll('[data-framer-name="Countdown Heading"]');
        const intros = section.querySelectorAll('[data-framer-name="Countdown Intro Text"]');
        const dividers = section.querySelectorAll('[data-framer-name="Countdown Divider"]');
        const timers = section.querySelectorAll('[data-framer-name="Countdown Timer"]');
        const buddhas = section.querySelectorAll('[data-framer-name="Countdown Backdrop"], .framer-m2ne5z');

        const applyStyles = (nodeList, topOffset) => {
          nodeList.forEach(el => {
            el.style.setProperty('top', topOffset + 'px', 'important');
            el.style.setProperty('opacity', '1', 'important');
            el.style.setProperty('visibility', 'visible', 'important');
            el.querySelectorAll('*').forEach(c => {
              c.style.setProperty('opacity', '1', 'important');
              c.style.setProperty('visibility', 'visible', 'important');
            });
          });
        };

        applyStyles(headings, countdownTop);
        applyStyles(intros, countdownTop + 44);
        applyStyles(dividers, countdownTop + 94);
        applyStyles(timers, countdownTop + 124);

        buddhas.forEach(buddha => {
          buddha.style.setProperty('top', buddhaTop + 'px', 'important');
          buddha.style.setProperty('opacity', '1', 'important');
          buddha.style.setProperty('visibility', 'visible', 'important');
          buddha.style.setProperty('display', 'block', 'important');
          buddha.style.setProperty('z-index', '5', 'important');
          buddha.querySelectorAll('*').forEach(child => {
            child.style.setProperty('opacity', '1', 'important');
            child.style.setProperty('visibility', 'visible', 'important');
          });
        });
      } else {
        // Mobile (< 768px)
        const allMaps = Array.from(section.querySelectorAll('[data-framer-name="Location Map"]'));
        const mapEl = allMaps.find(m => m.offsetHeight > 50) || allMaps[0];

        // Measure local layout offset strictly using offsetTop and offsetHeight (SCROLL INDEPENDENT!)
        let mapBottomLocal = 909;
        if (mapEl && mapEl.offsetHeight > 50) {
          mapBottomLocal = mapEl.offsetTop + mapEl.offsetHeight;
        }

        // Calculate countdownTop with natural 35px gap below map buttons
        let countdownTop = mapBottomLocal + 35;
        // Clamp countdownTop strictly between 930px and 1000px
        countdownTop = Math.max(930, Math.min(1000, countdownTop));

        // Buddha sits comfortably right below timer digits
        // Timer is at countdownTop + 104px (ends at countdownTop + 134px)
        // Buddha halo begins at countdownTop + 130px (~1065px - 1080px)
        let buddhaTop = countdownTop + 130;
        // Clamp buddhaTop strictly between 1060px and 1130px
        buddhaTop = Math.max(1060, Math.min(1130, buddhaTop));

        const headings = section.querySelectorAll('[data-framer-name="Countdown Heading"]');
        const intros = section.querySelectorAll('[data-framer-name="Countdown Intro Text"]');
        const dividers = section.querySelectorAll('[data-framer-name="Countdown Divider"]');
        const timers = section.querySelectorAll('[data-framer-name="Countdown Timer"]');
        const buddhas = section.querySelectorAll('[data-framer-name="Countdown Backdrop"], .framer-cb5woe');

        const applyStyles = (nodeList, topOffset) => {
          nodeList.forEach(el => {
            el.style.setProperty('top', topOffset + 'px', 'important');
            el.style.setProperty('opacity', '1', 'important');
            el.style.setProperty('visibility', 'visible', 'important');
            el.querySelectorAll('*').forEach(c => {
              c.style.setProperty('opacity', '1', 'important');
              c.style.setProperty('visibility', 'visible', 'important');
            });
          });
        };

        applyStyles(headings, countdownTop);
        applyStyles(intros, countdownTop + 34);
        applyStyles(dividers, countdownTop + 78);
        applyStyles(timers, countdownTop + 104);

        buddhas.forEach(buddha => {
          buddha.style.setProperty('top', buddhaTop + 'px', 'important');
          buddha.style.setProperty('opacity', '1', 'important');
          buddha.style.setProperty('visibility', 'visible', 'important');
          buddha.style.setProperty('display', 'block', 'important');
          buddha.style.setProperty('z-index', '5', 'important');
          buddha.querySelectorAll('*').forEach(child => {
            child.style.setProperty('opacity', '1', 'important');
            child.style.setProperty('visibility', 'visible', 'important');
          });
        });
      }
    } finally {
      isAdjusting = false;
    }
  }

  // Execution triggers: DOMContentLoaded, safe post-hydration timeouts, window load, resize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      adjustFlow();
      setTimeout(adjustFlow, 300);
      setTimeout(adjustFlow, 800);
      setTimeout(adjustFlow, 1500);
    });
  } else {
    adjustFlow();
    setTimeout(adjustFlow, 300);
    setTimeout(adjustFlow, 800);
    setTimeout(adjustFlow, 1500);
  }

  window.addEventListener('load', () => {
    adjustFlow();
    setTimeout(adjustFlow, 500);
  });

  window.addEventListener('resize', () => {
    adjustFlow();
  });

  // Re-adjust when user clicks on Location buttons/tabs
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-framer-name="Location Map"] button');
    if (btn) {
      setTimeout(adjustFlow, 50);
      setTimeout(adjustFlow, 300);
    }
  });
})();
