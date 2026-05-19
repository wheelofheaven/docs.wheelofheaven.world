// Client-side search backed by Zola's fuse_json index + Fuse.js.
(function () {
    var input = document.getElementById('search-input');
    var results = document.getElementById('search-results');
    if (!input || !results) return;

    var fuse = null;
    var loading = false;
    var highlightIndex = -1;

    // Load Fuse.js then the index lazily on first focus.
    function ensureLoaded() {
        if (fuse || loading) return Promise.resolve(fuse);
        loading = true;

        var fuseScript = new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = '/js/fuse.min.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });

        var indexFetch = fetch('/search_index.en.json').then(function (r) { return r.json(); });

        return Promise.all([fuseScript, indexFetch]).then(function (vals) {
            var data = vals[1];
            // Zola fuse_json format wraps the array under `pages` for some
            // versions; tolerate either shape.
            var docs = Array.isArray(data) ? data : (data.pages || []);
            fuse = new window.Fuse(docs, {
                keys: [
                    { name: 'title', weight: 0.6 },
                    { name: 'body',  weight: 0.4 },
                ],
                includeScore: true,
                threshold: 0.35,
                ignoreLocation: true,
                minMatchCharLength: 2,
            });
            return fuse;
        }).catch(function (err) {
            console.error('[search] init failed', err);
            loading = false;
            return null;
        });
    }

    function clearResults() {
        results.removeAttribute('data-open');
        results.innerHTML = '';
        highlightIndex = -1;
    }

    function render(items) {
        if (!items || !items.length) {
            results.setAttribute('data-open', '');
            results.innerHTML = '<div class="search__empty">No results.</div>';
            highlightIndex = -1;
            return;
        }
        var html = items.slice(0, 10).map(function (it, i) {
            var d = it.item;
            var body = (d.body || '').slice(0, 160).replace(/\s+/g, ' ');
            return (
                '<a class="search__result" href="' + (d.url || '#') + '" role="option" data-index="' + i + '">' +
                '<span class="search__result-title">' + escapeHtml(d.title || '(untitled)') + '</span>' +
                '<span class="search__result-context">' + escapeHtml(body) + '…</span>' +
                '</a>'
            );
        }).join('');
        results.innerHTML = html;
        results.setAttribute('data-open', '');
        highlightIndex = -1;
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function search(q) {
        if (!q || q.length < 2) { clearResults(); return; }
        ensureLoaded().then(function () {
            if (!fuse) return;
            render(fuse.search(q, { limit: 10 }));
        });
    }

    input.addEventListener('focus', ensureLoaded);
    input.addEventListener('input', function () { search(input.value.trim()); });

    // Keyboard nav over results.
    input.addEventListener('keydown', function (e) {
        var items = results.querySelectorAll('.search__result');
        if (e.key === 'Escape') { clearResults(); input.blur(); return; }
        if (!items.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightIndex = (highlightIndex + 1) % items.length;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightIndex = (highlightIndex - 1 + items.length) % items.length;
        } else if (e.key === 'Enter' && highlightIndex >= 0) {
            e.preventDefault();
            items[highlightIndex].click();
            return;
        } else {
            return;
        }
        items.forEach(function (el, i) {
            if (i === highlightIndex) el.setAttribute('data-highlight', '');
            else el.removeAttribute('data-highlight');
        });
        items[highlightIndex].scrollIntoView({ block: 'nearest' });
    });

    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !results.contains(e.target)) clearResults();
    });

    // Cmd/Ctrl-K focus shortcut.
    document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            input.focus();
            input.select();
        }
    });
})();
