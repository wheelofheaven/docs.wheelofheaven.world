+++
title = "Keyboard shortcuts modal"
description = "The help overlay listing available keyboard shortcuts, opened by `?`."
template = "page.html"
weight = 40
+++

`.keyboard-shortcuts-modal` is the overlay that lists every keyboard
shortcut the reader can use to navigate the site. Opens on `?`, closes
on `Escape` or backdrop click.

**Source:**
[`themes/bifrost/sass/components/_keyboard-shortcuts.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_keyboard-shortcuts.scss)

## Anatomy

| Class                                       | What                                              |
|---------------------------------------------|---------------------------------------------------|
| `.keyboard-shortcuts-modal`                 | Fixed full-screen container, `z-index: 200`.     |
| `.keyboard-shortcuts-modal--open`           | Open state — `opacity: 1`, content scales to 1.   |
| `.keyboard-shortcuts-modal__backdrop`       | Translucent black + `backdrop-filter: blur(8px)`. |
| `.keyboard-shortcuts-modal__content`        | The card itself; scales in from `0.95`.           |

Scope-aware: the modal shows different shortcuts on book pages
(reader navigation) vs. wiki pages (jump-to-section / language switch).
Underlying JS in `scripts/shortcuts.js`.

## Live examples

Press `?` on any page. E.g.
[/wiki/elohim/](https://www.wheelofheaven.world/wiki/elohim/) shows the
generic set;
[/library/the-book-which-tells-the-truth/](https://www.wheelofheaven.world/library/the-book-which-tells-the-truth/)
adds the book-reader set.
