/**
 * Section 4 Sequential Flow Controller
 * 
 * Organizes Location Map -> Countdown Block -> Buddha Backdrop sequentially:
 * 1. Location Map (map + venue info + location buttons)
 * 2. Countdown Block ("The countdown begins", family intro, star divider, live timer)
 *    placed directly after the map buttons with natural gap.
 * 3. Buddha Backdrop placed directly after the countdown, offset gracefully
 *    so the halo begins right below the timer digits.
 * 4. Section Container & Page Root dynamically clamped to the exact bottom edge of the
 *    Buddha backdrop (budR.bottom - secR.top) to eliminate any gap below the lotus pond
 *    across ALL viewports (Mobile, Tablet, Desktop, and Mobile "Desktop Site" mode).
 * 
 * Deterministic, scroll-independent, and clamped within strict layout boundaries.
 */
(function initSection4Flow() {
  let isAdjusting = false;

  function clampSectionHeight(section) {
    if (!section) return;
    const buddha = section.querySelector('[data-framer-name="Countdown Backdrop"], .framer-qqvm6f, .framer-m2ne5z, .framer-cb5woe');
    if (!buddha) return;

    const secR = section.getBoundingClientRect();
    const budR = buddha.getBoundingClientRect();
    const targetHeight = Math.ceil(budR.bottom - secR.top);
    if (targetHeight > 0) {
      section.style.setProperty('height', targetHeight + 'px', 'important');

      // Crucial: Also clamp parent breakpoint container and root element
      // so absolute-positioned sections do not leave empty parent scroll space!
      const parentContainer = section.parentElement;
      const totalPageHeight = Math.ceil(section.offsetTop + targetHeight);
      if (parentContainer && totalPageHeight > 0) {
        parentContainer.style.setProperty('height', totalPageHeight + 'px', 'important');
      }

      const root = document.querySelector('.framer-SNM3S');
      if (root && totalPageHeight > 0) {
        root.style.setProperty('height', totalPageHeight + 'px', 'important');
      }
    }

    const img = buddha.querySelector('img');
    if (img && !img.complete) {
      img.addEventListener('load', () => clampSectionHeight(section), { once: true });
    }
  }

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
          buddha.style.setProperty('z-index', '4', 'important');
          buddha.querySelectorAll('*').forEach(child => {
            child.style.setProperty('opacity', '1', 'important');
            child.style.setProperty('visibility', 'visible', 'important');
          });
        });

        clampSectionHeight(section);
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
          buddha.style.setProperty('z-index', '4', 'important');
          buddha.querySelectorAll('*').forEach(child => {
            child.style.setProperty('opacity', '1', 'important');
            child.style.setProperty('visibility', 'visible', 'important');
          });
        });

        clampSectionHeight(section);
      } else {
        // Mobile (< 768px)
        const allMaps = Array.from(section.querySelectorAll('[data-framer-name="Location Map"]'));
        const mapEl = allMaps.find(m => m.offsetHeight > 50) || allMaps[0];

        let mapBottomLocal = 909;
        if (mapEl && mapEl.offsetHeight > 50) {
          mapBottomLocal = mapEl.offsetTop + mapEl.offsetHeight;
        }

        let countdownTop = mapBottomLocal + 35;
        countdownTop = Math.max(930, Math.min(1000, countdownTop));

        let buddhaTop = countdownTop + 130;
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
          buddha.style.setProperty('z-index', '4', 'important');
          buddha.querySelectorAll('*').forEach(child => {
            child.style.setProperty('opacity', '1', 'important');
            child.style.setProperty('visibility', 'visible', 'important');
          });
        });

        clampSectionHeight(section);
      }
    } finally {
      isAdjusting = false;
    }
  }

  // Execution triggers
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      adjustFlow();
      setTimeout(adjustFlow, 100);
      setTimeout(adjustFlow, 300);
      setTimeout(adjustFlow, 800);
      setTimeout(adjustFlow, 1500);
    });
  } else {
    adjustFlow();
    setTimeout(adjustFlow, 100);
    setTimeout(adjustFlow, 300);
    setTimeout(adjustFlow, 800);
    setTimeout(adjustFlow, 1500);
  }

  window.addEventListener('load', () => {
    adjustFlow();
    setTimeout(adjustFlow, 300);
  });

  window.addEventListener('resize', () => {
    adjustFlow();
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-framer-name="Location Map"] button');
    if (btn) {
      setTimeout(adjustFlow, 50);
      setTimeout(adjustFlow, 300);
    }
  });
})();
