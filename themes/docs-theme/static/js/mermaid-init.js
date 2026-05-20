// Lazy-load Mermaid only on pages that actually have mermaid diagrams.
// Zola/giallo renders ```mermaid``` fenced blocks as
//   <pre><code data-lang="mermaid">...</code></pre>
// We rewrite each into a <div class="mermaid">…</div>, then load the
// mermaid bundle and call mermaid.run() on the rewritten divs.
//
// Theme: derived from the docs site's current resolved theme (light or
// dark), with the Bifrost palette stops mapped onto Mermaid's
// themeVariables. Re-rendered when the user toggles theme.

(function () {
    var blocks = document.querySelectorAll('pre > code[data-lang="mermaid"]');
    if (!blocks.length) return;

    // Rewrite <pre><code data-lang="mermaid">...</code></pre> into
    // <div class="mermaid">...</div>. Preserve the source text.
    var divs = [];
    blocks.forEach(function (codeEl) {
        var pre = codeEl.parentElement;
        if (!pre || pre.tagName !== 'PRE') return;
        var src = codeEl.textContent || '';
        var div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = src;
        pre.replaceWith(div);
        divs.push(div);
    });

    if (!divs.length) return;

    function resolvedTheme() {
        var attr = document.documentElement.getAttribute('data-theme');
        if (attr === 'light' || attr === 'dark') return attr;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Bifrost palette stops, mirrored from the SCSS tokens. Only the
    // ones Mermaid actually consults via themeVariables are exposed.
    var BIFROST = {
        yellow:   '#fbf8cc',
        pink:     '#fde4cf',
        lavender: '#f1c0e8',
        mauve:    '#cfbaf0',
        blue:     '#a3c4f3',
        cyan:     '#90dbf4',
        teal:     '#8eecf5',
        mint:     '#98f5e1',
        green:    '#b9fbc0',
        // greys
        gray100:  '#f8f9fa',
        gray300:  '#dee2e6',
        gray700:  '#495057',
        gray800:  '#343a40',
        gray900:  '#212529',
        gray950:  '#1b1f22',
    };

    function themeVarsFor(theme) {
        if (theme === 'dark') {
            return {
                background:         BIFROST.gray900,
                primaryColor:       BIFROST.gray800,
                primaryBorderColor: BIFROST.lavender,
                primaryTextColor:   BIFROST.gray100,
                secondaryColor:    'transparent',
                tertiaryColor:     'transparent',
                lineColor:          BIFROST.gray300,
                textColor:          BIFROST.gray100,
                edgeLabelBackground:BIFROST.gray900,
                clusterBkg:         BIFROST.gray950,
                clusterBorder:      BIFROST.gray800,
                nodeBorder:         BIFROST.lavender,
                mainBkg:            BIFROST.gray800,
            };
        }
        return {
            background:         '#ffffff',
            primaryColor:      'transparent',
            primaryBorderColor: BIFROST.mauve,
            primaryTextColor:   BIFROST.gray900,
            secondaryColor:    'transparent',
            tertiaryColor:     'transparent',
            lineColor:          BIFROST.gray700,
            textColor:          BIFROST.gray900,
            edgeLabelBackground:'#ffffff',
            clusterBkg:         BIFROST.gray100,
            clusterBorder:      BIFROST.gray300,
            nodeBorder:         BIFROST.mauve,
            mainBkg:            '#ffffff',
        };
    }

    function loadMermaid() {
        return new Promise(function (resolve, reject) {
            if (window.mermaid) return resolve(window.mermaid);
            var s = document.createElement('script');
            s.src = '/js/vendor/mermaid.min.js';
            s.onload = function () { resolve(window.mermaid); };
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    function render() {
        if (!window.mermaid) return;
        window.mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: themeVarsFor(resolvedTheme()),
            fontFamily: '"Jost", -apple-system, BlinkMacSystemFont, sans-serif',
            flowchart: {
                curve: 'basis',
                useMaxWidth: true,
                htmlLabels: true,
            },
        });
        // Reset the data-processed flag on re-render.
        divs.forEach(function (d) {
            if (d.getAttribute('data-processed')) {
                d.removeAttribute('data-processed');
                // Restore the original source from a stash if we made one.
                if (d.__mermaidSource) d.textContent = d.__mermaidSource;
            } else {
                d.__mermaidSource = d.textContent;
            }
        });
        window.mermaid.run({ nodes: divs });
    }

    loadMermaid().then(render).catch(function (err) {
        console.error('[mermaid] init failed', err);
    });

    // Re-render when the theme toggle flips.
    var themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            // Theme attribute is set synchronously by theme-toggle.js;
            // requestAnimationFrame to let it settle, then re-render.
            requestAnimationFrame(render);
        });
    }
    // Also react to OS-level scheme changes when no explicit theme is set.
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
            if (!document.documentElement.getAttribute('data-theme')) render();
        });
    }
})();
