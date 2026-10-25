// Footer language menu. The markup is the reading site's (#lang-switcher,
// .navbar__lang-*); the docs are English-only, so choosing a language opens
// the reading site in that language instead of switching this site.
(function () {
    var dropdown = document.getElementById('lang-switcher');
    if (!dropdown) return;
    var trigger = dropdown.querySelector('#lang-trigger');
    var menu = dropdown.querySelector('#lang-menu');
    var upstream = (dropdown.getAttribute('data-upstream') || '').replace(/\/+$/, '');
    if (!trigger || !menu) return;

    function setOpen(open) {
        menu.classList.toggle('navbar__lang-menu--open', open);
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    trigger.addEventListener('click', function (event) {
        event.stopPropagation();
        setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    Array.prototype.forEach.call(menu.querySelectorAll('[data-lang]'), function (option) {
        option.setAttribute('tabindex', '0');
        function go() {
            var lang = option.getAttribute('data-lang');
            window.location.href = upstream + (lang === 'en' ? '/' : '/' + lang + '/');
        }
        option.addEventListener('click', go);
        option.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(); }
        });
    });

    document.addEventListener('click', function (event) {
        if (!dropdown.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { setOpen(false); trigger.focus(); }
    });
})();
