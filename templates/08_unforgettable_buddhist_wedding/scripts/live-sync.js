(function() {
    // =========================================================================
    // 1. SCROLL POSITION PRESERVATION GUARDIAN
    // Strictly locks scroll position across reloads and blocks router resets
    // =========================================================================
    try {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    } catch (e) {}

    function saveScroll() {
        const y = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (y > 0) {
            sessionStorage.setItem('antigravity_live_scroll_y', y);
        }
    }
    window.addEventListener('scroll', saveScroll, { passive: true });
    window.addEventListener('beforeunload', saveScroll);

    // Restore scroll position immediately on page boot
    const savedY = sessionStorage.getItem('antigravity_live_scroll_y');
    if (savedY !== null && parseFloat(savedY) > 5) {
        const targetY = parseFloat(savedY);
        const originalScrollTo = window.scrollTo.bind(window);
        const lockDuration = 2200; // Guard during React hydration window
        const lockUntil = performance.now() + lockDuration;

        // Block Framer/React router from executing scrollTo(0, 0)
        window.scrollTo = function(x, y) {
            if (performance.now() < lockUntil) {
                if (y === 0 || (typeof x === 'object' && x.top === 0)) {
                    return; // Suppress router scroll-to-top
                }
            }
            return originalScrollTo.apply(this, arguments);
        };

        // Pin scroll position firmly during initial paint & hydration
        function lockScroll() {
            if (performance.now() < lockUntil) {
                const currentY = window.pageYOffset || document.documentElement.scrollTop;
                if (Math.abs(currentY - targetY) > 2) {
                    originalScrollTo(0, targetY);
                }
                requestAnimationFrame(lockScroll);
            } else {
                window.scrollTo = originalScrollTo;
            }
        }
        originalScrollTo(0, targetY);
        requestAnimationFrame(lockScroll);
    }

    // =========================================================================
    // 2. LIVE CODE-SAVE DETECTOR & ZERO-SCROLL HOT STYLESHEET UPDATER
    // Directly updates styles on Save without refreshing the page
    // =========================================================================
    if (typeof EventSource !== 'undefined') {
        let es = null;
        let isUpdating = false;

        function connectLiveSync() {
            es = new EventSource('/__live_reload');

            es.onmessage = async function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type !== 'change' || isUpdating) return;
                    isUpdating = true;

                    // Fetch the updated file silently in the background
                    const res = await fetch(window.location.pathname + '?_antigravity_hot=' + Date.now(), { cache: 'no-store' });
                    const html = await res.text();
                    const doc = new DOMParser().parseFromString(html, 'text/html');

                    // 1. Hot-swap the CSS shield (instant zero-scroll update)
                    const newStyle = doc.getElementById('antigravity-watermark-shield');
                    const oldStyle = document.getElementById('antigravity-watermark-shield');
                    if (newStyle && oldStyle) {
                        oldStyle.textContent = newStyle.textContent;
                        console.log('⚡ [Hot Update] Code saved! Styles updated directly without scrolling.');
                        // Trigger canvas & layout updates
                        window.dispatchEvent(new Event('resize'));
                        setTimeout(() => { isUpdating = false; }, 200);
                        return;
                    }

                    // 2. If structural HTML changed, reload while strictly locking scroll
                    saveScroll();
                    window.location.reload();
                } catch (err) {
                    saveScroll();
                    window.location.reload();
                }
            };

            es.onerror = function() {
                es.close();
                setTimeout(connectLiveSync, 2000);
            };
        }

        connectLiveSync();
    }
})();