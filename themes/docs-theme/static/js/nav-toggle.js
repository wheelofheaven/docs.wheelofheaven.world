// Open/close the mobile sidebar drawer.
(function () {
    var toggle = document.querySelector('.site-header__nav-toggle');
    var body = document.getElementById('site-body');
    if (!toggle || !body) return;

    function setOpen(open) {
        if (open) {
            body.setAttribute('data-nav-open', '');
            toggle.setAttribute('aria-expanded', 'true');
        } else {
            body.removeAttribute('data-nav-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    }

    toggle.addEventListener('click', function () {
        setOpen(!body.hasAttribute('data-nav-open'));
    });

    // Close on backdrop click.
    var backdrop = body.querySelector('.sidebar-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', function () { setOpen(false); });
    }

    // Close on escape.
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && body.hasAttribute('data-nav-open')) {
            setOpen(false);
            toggle.focus();
        }
    });

    // Close on link click (so navigating doesn't leave drawer open).
    body.querySelectorAll('.sidebar a').forEach(function (a) {
        a.addEventListener('click', function () { setOpen(false); });
    });
})();
