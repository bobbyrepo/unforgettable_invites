(function() {
    let ticking = false;
    function updateTrees() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const trees = document.querySelectorAll('.framer-trees, [data-framer-name="Trees"]');
        if (trees.length === 0) return;

        // Upward parallax rate (scrolls UP as you scroll down, matching mountains & clouds)
        const customSpeed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--trees-parallax-speed')) || 0.42;
        const y = -scrollY * customSpeed;

        trees.forEach(el => {
            el.style.transform = 'translate3d(0, ' + y + 'px, 0)';
        });
        ticking = false;
    }
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateTrees);
            ticking = true;
        }
    }, { passive: true });
    window.addEventListener('resize', updateTrees);
    window.addEventListener('load', updateTrees);
    document.addEventListener('DOMContentLoaded', updateTrees);
})();