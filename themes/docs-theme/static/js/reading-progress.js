// Reading progress bar + back-to-top button. Both bound to the page's
// main scroll position. Skipped entirely on short pages (no scroll
// distance to read) and on prefers-reduced-motion.
(function () {
    var bar = document.getElementById('reading-progress');
    var btn = document.getElementById('back-to-top');
    if (!bar && !btn) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function compute() {
        var doc = document.documentElement;
        var scrolled = doc.scrollTop || document.body.scrollTop;
        var height = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
        var pct = height > 0 ? (scrolled / height) : 0;
        if (bar) {
            bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, pct)) + ')';
        }
        if (btn) {
            // Show after ~400px scrolled and only when there's at least
            // a screenful left to scroll back through.
            var shouldShow = scrolled > 400 && height > 600;
            if (shouldShow) btn.setAttribute('data-visible', '');
            else btn.removeAttribute('data-visible');
        }
    }

    // requestAnimationFrame coalesces multiple scroll events per frame.
    var ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            compute();
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    compute();

    if (btn) {
        btn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: reduced ? 'auto' : 'smooth',
            });
        });
    }
})();
