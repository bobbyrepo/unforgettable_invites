(function() {
    const selectors = [
        '#__framer-badge-container',
        '#__framer-badge',
        '.framer-badge',
        '#__framer-editorbar',
        '#__framer-editorbar-container',
        '[data-framer-name*="Watermark" i]',
        '[data-framer-name*="watermark" i]',
        '[name*="Watermark" i]',
        '.framer-drjap9-container',
        '.framer-1bbdmlz',
        '.framer-1gcmhtz',
        '.framer-facrej',
        '.framer-dmgyni',
        '.framer-17sr7rc',
        '.framer-g3m3gs',
        '.framer-1n0n3bs',
        '.framer-1charvo',
        '.framer-1ue5gl8',
        '.framer-han26s',
        '.framer-z4cae1',
        '[data-framer-name="Corner Decoration"]',
        '[name="Corner Decoration"]',
        '.framer-r25czy-container',
        '.framer-icwjlw-container',
        '.framer-1b2mwsy-container',
        '[data-framer-name="Waving Flag"]',
        '[name="Waving Flag"]',
        '[data-framer-name*="Waving Flag" i]',
        '[name*="Waving Flag" i]',
        '.framer-1gvvbdf'
    ];

    function purgeWatermarks() {
        for (let i = 0; i < selectors.length; i++) {
            const nodes = document.querySelectorAll(selectors[i]);
            for (let j = 0; j < nodes.length; j++) {
                const el = nodes[j];
                el.style.setProperty('display', 'none', 'important');
                el.style.setProperty('opacity', '0', 'important');
                if (el.parentNode) el.parentNode.removeChild(el);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', purgeWatermarks);
    } else {
        purgeWatermarks();
    }
    window.addEventListener('load', purgeWatermarks);

    // Timed cleanup passes after hydration completes (no continuous observer)
    setTimeout(purgeWatermarks, 300);
    setTimeout(purgeWatermarks, 1000);
    setTimeout(purgeWatermarks, 2500);
})();
