// Client-side search backed by Zola's fuse_json index + Fuse.js.
(function () {
    var input = document.getElementById('search-input');
    var results = document.getElementById('search-results');
    if (!input || !results) return;

    // Show Ctrl+K instead of ⌘K on non-Apple platforms. We check both
    // userAgentData (modern) and platform (fallback) since Safari/iOS
    // don't expose userAgentData.
    var hint = document.getElementById('search-shortcut');
    if (hint) {
        var isMac = /Mac|iPhone|iPad|iPod/.test(
            (navigator.userAgentData && navigator.userAgentData.platform) ||
            navigator.platform ||
            ''
        );
        hint.textContent = isMac ? '⌘K' : 'Ctrl K';
    }

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
                includeMatches: true,
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
            var matches = it.matches || [];
            var title = highlightMatches(d.title || '(untitled)', findKey(matches, 'title'));

            // Build a window of body text centered on the first body match
            // so the user sees the matched term in context, not just the
            // opening of the page.
            var bodyMatch = findKey(matches, 'body');
            var ctx = buildBodyContext(d.body || '', bodyMatch);

            // Derive the section breadcrumb from the URL path. For
            //   /contributing/content/wiki-entry/  →  "Contributing → Content"
            //   /reference/glossary/               →  "Reference"
            //   /                                  →  ""  (omit)
            var section = sectionFromUrl(d.url || '');

            return (
                '<a class="search__result" href="' + (d.url || '#') + '" role="option" data-index="' + i + '">' +
                (section ? '<span class="search__result-section">' + escapeHtml(section) + '</span>' : '') +
                '<span class="search__result-title">' + title + '</span>' +
                '<span class="search__result-context">' + ctx + '</span>' +
                '</a>'
            );
        }).join('');
        results.innerHTML = html;
        results.setAttribute('data-open', '');
        highlightIndex = -1;
    }

    function findKey(matches, key) {
        for (var i = 0; i < matches.length; i++) {
            if (matches[i].key === key) return matches[i];
        }
        return null;
    }

    // Wrap matched character ranges in <mark> tags, preserving any
    // text outside the ranges. Indices come from Fuse's matches.indices
    // array of [start, end] inclusive pairs.
    function highlightMatches(text, match) {
        if (!match || !match.indices || !match.indices.length) {
            return escapeHtml(text);
        }
        // Sort ranges; merge overlapping.
        var ranges = match.indices.slice().sort(function (a, b) { return a[0] - b[0]; });
        var out = '';
        var pos = 0;
        for (var i = 0; i < ranges.length; i++) {
            var s = ranges[i][0];
            var e = ranges[i][1] + 1; // make end exclusive
            if (s < pos) s = pos;     // skip overlap
            if (s > pos) out += escapeHtml(text.slice(pos, s));
            if (e > s) out += '<mark class="search__hit">' + escapeHtml(text.slice(s, e)) + '</mark>';
            pos = e;
        }
        if (pos < text.length) out += escapeHtml(text.slice(pos));
        return out;
    }

    // Pick a ~160-char window around the first match in body text, with
    // the matched range wrapped in <mark>. If no match, fall back to the
    // first 160 chars of body.
    function buildBodyContext(body, match) {
        var compact = body.replace(/\s+/g, ' ');
        var WINDOW = 160;

        if (!match || !match.indices || !match.indices.length) {
            return escapeHtml(compact.slice(0, WINDOW)) + '…';
        }

        // Locate the first match in the (uncompacted) body, then compute
        // a window around it in the compacted body. Easier path: just
        // operate on the compacted body and find the matched substring.
        var firstStart = match.indices[0][0];
        var firstEnd   = match.indices[0][1] + 1;
        var matchText  = body.slice(firstStart, firstEnd);
        var compactIdx = compact.indexOf(matchText);
        if (compactIdx < 0) compactIdx = 0;

        var start = Math.max(0, compactIdx - 40);
        var end   = Math.min(compact.length, start + WINDOW);
        if (end - start < WINDOW) start = Math.max(0, end - WINDOW);

        var snippet = compact.slice(start, end);
        var matchPosInSnippet = compactIdx - start;

        var before  = escapeHtml(snippet.slice(0, matchPosInSnippet));
        var hit     = escapeHtml(snippet.slice(matchPosInSnippet, matchPosInSnippet + matchText.length));
        var after   = escapeHtml(snippet.slice(matchPosInSnippet + matchText.length));

        var prefix = start > 0 ? '…' : '';
        var suffix = end < compact.length ? '…' : '';

        return prefix + before + '<mark class="search__hit">' + hit + '</mark>' + after + suffix;
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // URL path → "Section → Subsection" label. Drops the trailing
    // page slug. Returns "" for the root page.
    var SECTION_LABELS = {
        'getting-started':       'Getting Started',
        'contributing':          'Contributing',
        'contributing/content':  'Contributing → Content',
        'contributing/dev':      'Contributing → Dev',
        'architecture':          'Architecture',
        'architecture/sites':    'Architecture → Sites',
        'reference':             'Reference',
    };
    function sectionFromUrl(url) {
        if (!url) return '';
        var path;
        try { path = new URL(url, window.location.origin).pathname; }
        catch (_) { path = url; }
        var segs = path.split('/').filter(Boolean);
        if (segs.length <= 1) return ''; // root or single-segment page
        // Drop the final slug; what remains is the section path.
        var sectionPath = segs.slice(0, -1).join('/');
        if (SECTION_LABELS[sectionPath]) return SECTION_LABELS[sectionPath];
        // Fallback: titlecase the path segments.
        return sectionPath
            .split('/')
            .map(function (s) {
                return s.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
            })
            .join(' → ');
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
