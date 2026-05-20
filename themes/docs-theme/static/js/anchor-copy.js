// Click on a heading anchor (# next to h2/h3/h4) → copy the absolute
// URL to clipboard, show a brief "copied!" feedback. Falls back to
// normal hash-link behavior if the clipboard API isn't available.
(function () {
    var anchors = document.querySelectorAll('a.zola-anchor');
    if (!anchors.length || !navigator.clipboard) return;

    anchors.forEach(function (a) {
        a.addEventListener('click', function (e) {
            // Only intercept plain left-click; let Cmd/Ctrl/Shift-click
            // open in new tab as normal.
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();

            var href = a.getAttribute('href') || '';
            var url = new URL(href, window.location.href).href;

            navigator.clipboard.writeText(url).then(function () {
                // Push the hash into the location bar without scrolling
                // back to the heading (avoid the click-from-elsewhere
                // jump). Then bring up a tiny tooltip.
                history.replaceState(null, '', href);
                showTooltip(a);
            }).catch(function () {
                // Clipboard failed (permissions, http, etc.) — fall back
                // to normal in-page navigation.
                window.location.hash = href;
            });
        });
    });

    function showTooltip(anchor) {
        var existing = document.getElementById('anchor-copy-tooltip');
        if (existing) existing.remove();

        var tt = document.createElement('span');
        tt.id = 'anchor-copy-tooltip';
        tt.className = 'anchor-copy-tooltip';
        tt.textContent = 'Link copied';
        anchor.appendChild(tt);

        // Trigger CSS transition then auto-remove.
        requestAnimationFrame(function () {
            tt.setAttribute('data-visible', '');
        });
        setTimeout(function () {
            tt.removeAttribute('data-visible');
            setTimeout(function () { tt.remove(); }, 200);
        }, 1100);
    }
})();
