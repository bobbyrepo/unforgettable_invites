/**
 * Unforgettable Invites — Tree Parallax & Upward Entrance Engine
 * Animates trees upwards on initial browser load/reload in perfect sync
 * with the temple, sky, and hero landscape layers, then smoothly transitions
 * to scroll-driven multiplane parallax depth.
 */
(function () {
    'use strict';

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Reduced motion: directly apply passive scroll parallax without entrance animation
        function simpleUpdate() {
            const trees = document.querySelectorAll('.framer-trees, [data-framer-name="Trees"]');
            if (!trees.length) return;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
            const speed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--trees-parallax-speed')) || 0.20;
            const y = Math.round(scrollY * speed * 100) / 100;
            trees.forEach(el => el.style.setProperty('transform', 'translate3d(0, ' + y + 'px, 0)', 'important'));
        }
        window.addEventListener('scroll', simpleUpdate, { passive: true });
        window.addEventListener('resize', simpleUpdate, { passive: true });
        simpleUpdate();
        return;
    }

    let entranceStarted = false;
    let entranceStartTime = null;
    let entranceCompleted = false;
    let ticking = false;

    const isMobile = () => window.innerWidth < 1025;
    const getInitialOffset = () => isMobile() ? 375 : 211;
    const getDuration = () => isMobile() ? 2000 : 1800;
    const getDelay = () => isMobile() ? 80 : 0;

    /**
     * Easing function matching Framer's spring transitions for Temple & Hero layers:
     * - Mobile: Critically damped spring (bounce 0, duration 2.0s)
     * - Desktop: Gentle spring with subtle overshoot (bounce 0.2, duration 1.8s)
     */
    function getEasedProgress(p, mobile) {
        if (p <= 0) return 0;
        if (p >= 1) return 1;
        if (mobile) {
            return 1 - Math.pow(1 - p, 3.5);
        } else {
            const decay = Math.exp(-5.0 * p);
            const osc = Math.cos(5.5 * p);
            return 1 - decay * osc;
        }
    }

    function getElements() {
        return document.querySelectorAll('.framer-trees, [data-framer-name="Trees"]');
    }

    function step(now) {
        const trees = getElements();
        if (!trees || trees.length === 0) {
            // Keep waiting for trees element to mount into DOM
            requestAnimationFrame(step);
            return;
        }

        const mobile = isMobile();
        const startY = getInitialOffset();

        // 1. Initial capture: pin element at starting lower position on frame 1
        if (!entranceStarted) {
            entranceStarted = true;
            entranceStartTime = now + getDelay();

            trees.forEach(el => {
                el.style.setProperty('transform', 'translate3d(0, ' + startY + 'px, 0)', 'important');
                el.style.setProperty('will-change', 'transform', 'important');
            });

            requestAnimationFrame(step);
            return;
        }

        // 2. Entrance animation calculation
        const duration = getDuration();
        let entranceY = 0;

        if (!entranceCompleted) {
            if (now < entranceStartTime) {
                entranceY = startY;
            } else {
                const elapsed = now - entranceStartTime;
                const progress = Math.min(1, elapsed / duration);
                const eased = getEasedProgress(progress, mobile);
                entranceY = Math.max(0, startY * (1 - eased));

                if (progress >= 1) {
                    entranceCompleted = true;
                    entranceY = 0;
                }
            }
        }

        // 3. Coordinate with scroll parallax (downward translation on scroll)
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        const customSpeed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--trees-parallax-speed')) || 0.20;
        const parallaxY = scrollY * customSpeed;

        const totalY = Math.round((entranceY + parallaxY) * 10) / 10;

        trees.forEach(el => {
            el.style.setProperty('transform', 'translate3d(0, ' + totalY + 'px, 0)', 'important');
        });

        // 4. Continue animation loop or complete
        if (!entranceCompleted) {
            requestAnimationFrame(step);
        } else {
            ticking = false;
        }
    }

    /**
     * Standard scroll-driven parallax handler once entrance animation has finished
     */
    function updateTrees() {
        const trees = getElements();
        if (!trees || trees.length === 0) return;

        const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        const customSpeed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--trees-parallax-speed')) || 0.20;
        const y = Math.round(scrollY * customSpeed * 100) / 100;

        trees.forEach(el => {
            el.style.setProperty('transform', 'translate3d(0, ' + y + 'px, 0)', 'important');
        });
        ticking = false;
    }

    function onScroll() {
        if (!entranceCompleted) {
            // During entrance animation, step() already adds parallaxY continuously
            return;
        }
        if (!ticking) {
            window.requestAnimationFrame(updateTrees);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        if (entranceCompleted) updateTrees();
    });

    // Start entrance animation loop immediately
    requestAnimationFrame(step);
})();
