// =========================================================================
// HIGH-PERFORMANCE 60FPS CSS 3D BUDDHIST FLAG ANIMATOR
// 100% Hardware-Composited, Instant Eager Paint, Zero Compositor Stall
// =========================================================================

(function() {
    // Eager preload in JS memory to ensure zero decode lag
    const preloadedR = new Image(); preloadedR.src = './images/Right flag.webp';
    const preloadedL = new Image(); preloadedL.src = './images/Left Flag.webp';

    const flagConfigs = [
        // Front Walkway Flags (High visual focus, compound 3D sway + silk sheen ripple)
        { className: 'buddhist-flag-right-1', prefix: '--flag-r1', isLeft: false, texture: './images/Right flag.webp', delay: '0s', animated: true },
        { className: 'buddhist-flag-right-2', prefix: '--flag-r2', isLeft: false, texture: './images/Right flag.webp', delay: '-1.4s', animated: true },
        { className: 'buddhist-flag-left-1',  prefix: '--flag-l1', isLeft: true,  texture: './images/Left Flag.webp',  delay: '-0.7s', animated: true },
        { className: 'buddhist-flag-left-2',  prefix: '--flag-l2', isLeft: true,  texture: './images/Left Flag.webp',  delay: '-2.1s', animated: true },
        // Back Walkway Flags (Distant perspective, static to conserve compositing layers)
        { className: 'buddhist-flag-right-3', prefix: '--flag-r3', isLeft: false, texture: './images/Right flag.webp', animated: false },
        { className: 'buddhist-flag-right-4', prefix: '--flag-r4', isLeft: false, texture: './images/Right flag.webp', animated: false },
        { className: 'buddhist-flag-left-3',  prefix: '--flag-l3', isLeft: true,  texture: './images/Left Flag.webp',  animated: false },
        { className: 'buddhist-flag-left-4',  prefix: '--flag-l4', isLeft: true,  texture: './images/Left Flag.webp',  animated: false }
    ];

    function getVisibleTemples() {
        const temples = document.querySelectorAll('[data-framer-name="Temple"], .framer-hmdytf, .framer-13lghix, .framer-1sm6may');
        const visible = [];
        temples.forEach(t => {
            if (t.offsetParent !== null || t.offsetWidth > 0 || t.clientHeight > 0) {
                visible.push(t);
            }
        });
        return visible.length > 0 ? visible : (temples.length > 0 ? [temples[0]] : []);
    }

    let isVisibleOnScreen = true;

    function mountFlags() {
        const activeTemples = getVisibleTemples();
        if (!activeTemples || activeTemples.length === 0 || !activeTemples[0]) return false;

        activeTemples.forEach(temple => {
            flagConfigs.forEach(cfg => {
                let container = temple.querySelector('.' + cfg.className);
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'buddhist-pillar-flag-container ' + cfg.className;

                    const img = document.createElement('img');
                    img.className = 'buddhist-flag-static-img';
                    img.src = cfg.texture;
                    img.width = 390;
                    img.height = 1496;
                    img.alt = 'Sacred Buddhist Temple Flag';
                    img.loading = 'eager';
                    img.decoding = 'sync';
                    if ('fetchPriority' in img) img.fetchPriority = 'high';

                    let sheen = null;
                    if (cfg.animated) {
                        img.classList.add(cfg.isLeft ? 'buddhist-flag-wave-left' : 'buddhist-flag-wave-right');
                        img.style.animationDelay = cfg.delay;

                        // Fast GPU Alpha-gradient sheen overlay for silk ripple
                        sheen = document.createElement('div');
                        sheen.className = 'buddhist-flag-sheen';
                        sheen.style.animationDelay = cfg.delay;
                    }

                    container.appendChild(img);
                    if (sheen) container.appendChild(sheen);
                    temple.appendChild(container);
                }
            });

            // Pause animations when hero scrolls out of view to save battery/GPU
            if ('IntersectionObserver' in window && !temple.__observerAttached) {
                temple.__observerAttached = true;
                const obs = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        isVisibleOnScreen = entry.isIntersecting;
                        const animEls = temple.querySelectorAll('.buddhist-flag-wave-left, .buddhist-flag-wave-right, .buddhist-flag-sheen');
                        animEls.forEach(el => {
                            el.style.animationPlayState = isVisibleOnScreen ? 'running' : 'paused';
                        });
                    });
                }, { threshold: 0.05 });
                obs.observe(temple);
            }
        });
        return true;
    }

    // Instant proactive mount
    if (!mountFlags()) {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (mountFlags() || attempts > 20) {
                clearInterval(interval);
            }
        }, 30);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountFlags, { once: true });
    }
    window.addEventListener('load', mountFlags, { once: true });

    // Responsive resize check
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(mountFlags, 150);
    });
})();
