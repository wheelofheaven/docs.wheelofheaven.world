// Light/dark toggle. Stores preference in localStorage; pre-paint script
// in base.html reads it before first render so we don't flash.
(function () {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    function currentTheme() {
        var explicit = document.documentElement.getAttribute('data-theme');
        if (explicit === 'light' || explicit === 'dark') return explicit;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    btn.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('docs-theme', next); } catch (_) {}
    });
})();
