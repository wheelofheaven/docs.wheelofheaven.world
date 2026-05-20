// Keyboard shortcuts modal — opens with ?, lists keybindings.
// Pure CSS/HTML toggle via [data-open]; no library, no focus-trap
// library (we manage focus manually).
(function () {
    var modal = document.getElementById('shortcuts-modal');
    if (!modal) return;

    var closeBtn = modal.querySelector('.shortcuts__close');
    var lastFocus = null;

    function isTypingTarget(t) {
        if (!t) return false;
        if (t.isContentEditable) return true;
        var tag = (t.tagName || '').toLowerCase();
        return tag === 'input' || tag === 'textarea' || tag === 'select';
    }

    function open() {
        lastFocus = document.activeElement;
        modal.setAttribute('data-open', '');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // Focus the close button so Escape works immediately.
        if (closeBtn) closeBtn.focus();
    }
    function close() {
        modal.removeAttribute('data-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }
    function isOpen() {
        return modal.hasAttribute('data-open');
    }

    // Open on `?` from anywhere (except when typing).
    document.addEventListener('keydown', function (e) {
        if (e.defaultPrevented) return;
        if (e.key === '?' && !isTypingTarget(e.target)) {
            e.preventDefault();
            open();
            return;
        }
        if (e.key === 'Escape' && isOpen()) {
            e.preventDefault();
            close();
        }
    });

    // Close on backdrop click + on close-button click.
    modal.addEventListener('click', function (e) {
        if (e.target === modal) close();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Update the displayed modifier (⌘ vs Ctrl) based on platform.
    var isMac = /Mac|iPhone|iPad|iPod/.test(
        (navigator.userAgentData && navigator.userAgentData.platform) ||
        navigator.platform ||
        ''
    );
    modal.querySelectorAll('[data-mod]').forEach(function (el) {
        el.textContent = isMac ? '⌘' : 'Ctrl';
    });
})();
