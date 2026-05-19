// Add a copy-to-clipboard button to every <pre><code> block.
(function () {
    var blocks = document.querySelectorAll('pre > code');
    blocks.forEach(function (codeEl) {
        var pre = codeEl.parentElement;
        if (!pre || pre.querySelector('.code-copy-btn')) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'code-copy-btn';
        btn.setAttribute('aria-label', 'Copy code');
        btn.textContent = 'Copy';

        btn.addEventListener('click', function () {
            var text = codeEl.innerText;
            navigator.clipboard.writeText(text).then(function () {
                btn.textContent = 'Copied';
                btn.setAttribute('data-copied', '');
                setTimeout(function () {
                    btn.textContent = 'Copy';
                    btn.removeAttribute('data-copied');
                }, 1500);
            }).catch(function () {
                btn.textContent = 'Error';
                setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
            });
        });

        pre.appendChild(btn);
    });
})();
