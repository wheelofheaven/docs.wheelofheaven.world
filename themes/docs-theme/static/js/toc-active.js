// Highlight the ToC entry corresponding to the section in view.
(function () {
    var tocLinks = Array.from(document.querySelectorAll('.toc__link'));
    if (!tocLinks.length) return;

    var headings = tocLinks
        .map(function (link) {
            var id = link.getAttribute('href') || '';
            if (id.charAt(0) !== '#') return null;
            var el = document.getElementById(id.slice(1));
            return el ? { id: id, el: el, link: link } : null;
        })
        .filter(Boolean);
    if (!headings.length) return;

    function setActive(activeId) {
        tocLinks.forEach(function (l) {
            if (l.getAttribute('href') === activeId) {
                l.setAttribute('data-active', '');
            } else {
                l.removeAttribute('data-active');
            }
        });
    }

    // Use IntersectionObserver — when a heading scrolls into view near
    // the top of the viewport, mark its ToC link active.
    var observer = new IntersectionObserver(function (entries) {
        var topMost = null;
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                if (!topMost || entry.boundingClientRect.top < topMost.boundingClientRect.top) {
                    topMost = entry;
                }
            }
        });
        if (topMost) {
            var match = headings.find(function (h) { return h.el === topMost.target; });
            if (match) setActive(match.id);
        }
    }, {
        rootMargin: '-15% 0px -75% 0px',
        threshold: 0,
    });

    headings.forEach(function (h) { observer.observe(h.el); });
})();
