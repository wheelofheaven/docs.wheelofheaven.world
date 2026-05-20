// Light/dark toggle. Stores preference in localStorage; pre-paint script
// in base.html reads it before first render so we don't flash.
(function () {
    var btn = document.querySelector('.theme-toggle');
    var light = document.getElementById('syntax-light');
    var dark = document.getElementById('syntax-dark');

    function currentTheme() {
        var explicit = document.documentElement.getAttribute('data-theme');
        if (explicit === 'light' || explicit === 'dark') return explicit;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applySyntaxCss(explicit) {
        if (!light || !dark) return;
        if (explicit === 'light') {
            light.media = 'all';
            dark.media = 'not all';
        } else if (explicit === 'dark') {
            light.media = 'not all';
            dark.media = 'all';
        } else {
            light.media = '(prefers-color-scheme: light)';
            dark.media = '(prefers-color-scheme: dark)';
        }
    }

    if (!btn) return;

    btn.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        applySyntaxCss(next);
        try { localStorage.setItem('docs-theme', next); } catch (_) {}
    });
})();
