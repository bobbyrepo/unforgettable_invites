/**
 * Unforgettable Invites — Sky Parallax Engine (Mobile & Desktop)
 * Configured with upward positioning & upward parallax scroll for mobile devices,
 * creating multiplane depth behind the sacred temple.
 */
(function () {
    'use strict';

    // 1. Inject responsive coverage CSS immediately
    try {
        const styleId = 'unforgettable-sky-parallax-css';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @media (max-width: 1199.98px) {
                    .framer-b8pafc, .framer-l0jkpb, [data-framer-name="Sky Background"] {
                        height: 2600px !important;
                        min-height: 2600px !important;
                        will-change: transform;
                    }
                }
            `;
            (document.head || document.documentElement).appendChild(style);
        }
    } catch (e) {}

    let ticking = false;
    let cachedElements = null;

    function getSkyElements() {
        if (!cachedElements || cachedElements.length === 0 || !document.contains(cachedElements[0])) {
            cachedElements = document.querySelectorAll(
                '[data-framer-name="Sky Background"], .framer-b8pafc, .framer-l0jkpb, .framer-pe8q9z'
            );
            if (cachedElements && cachedElements.length > 0) {
                cachedElements.forEach(el => {
                    el.style.willChange = 'transform';
                    if (el.classList.contains('framer-b8pafc') || el.classList.contains('framer-l0jkpb')) {
                        el.style.minHeight = '2200px';
                        el.style.height = '2200px';
                    }
                });
            }
        }
        return cachedElements;
    }

    function updateSkyParallax() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            ticking = false;
            return;
        }

        const elements = getSkyElements();
        if (!elements || elements.length === 0) {
            ticking = false;
            return;
        }

        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        const isMobile = window.innerWidth < 1200;

        // Read configurable speeds and offsets
        const rootStyle = getComputedStyle(document.documentElement);

        let y = 0;
        if (isMobile) {
            // For mobile devices: move the sky upward both in initial offset and upward parallax rate
            const mobileOffset = parseFloat(rootStyle.getPropertyValue('--sky-mobile-offset-y')) || -1080; // Default: upward shift behind temple
            const mobileSpeed = parseFloat(rootStyle.getPropertyValue('--sky-parallax-speed-mobile')) || 0.25; // Upward rate matching trees/temple
            y = Math.round((mobileOffset - (scrollY * mobileSpeed)) * 100) / 100;
        } else {
            // Desktop: standard gentle depth drift
            const desktopOffset = parseFloat(rootStyle.getPropertyValue('--sky-desktop-offset-y')) || -515;
            const customSpeed = parseFloat(rootStyle.getPropertyValue('--sky-parallax-speed'));
            const desktopSpeed = parseFloat(rootStyle.getPropertyValue('--sky-parallax-speed-desktop')) || 0.35;
            const speed = !isNaN(customSpeed) ? customSpeed : desktopSpeed;
            y = Math.round((desktopOffset + scrollY * speed) * 100) / 100;
        }

        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (el.offsetWidth > 0 || el.offsetHeight > 0) {
                el.style.setProperty('transform', 'translate3d(0, ' + y + 'px, 0)', 'important');
            }
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateSkyParallax);
            ticking = true;
        }
    }

    function handleResize() {
        cachedElements = null;
        requestTick();
    }

    // Event listeners
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    window.addEventListener('load', handleResize);
    document.addEventListener('DOMContentLoaded', handleResize);

    // Initial runs across lifecycle
    requestTick();
    setTimeout(handleResize, 100);
    setTimeout(handleResize, 500);
    setTimeout(handleResize, 1500);
})();
