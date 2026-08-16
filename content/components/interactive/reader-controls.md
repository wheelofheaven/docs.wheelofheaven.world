+++
title = "Reader controls"
description = "Mobile floating action button (`reader-fab`), the Continue panel and its nav badge, and the scroll progress bar (`reading-progress`)."
template = "page.html"
weight = 20
+++

These Bifrost components compose the reader's control surface on long
content pages. They're documented together because they share a single
mental model: tools that help a reader navigate long content — and find
their way back into it — on a small screen.

## `.reader-fab`

Mobile-only floating action button that replaces the standalone
[`back-to-top`](../../chrome/back-to-top/) button on small screens.
Tapping the button expands a glassmorphic panel with reader-context
options: Contents, theme, font, bookmarks, top. Hidden above 1000px.

**Source:**
[`themes/bifrost/sass/components/_reader-fab.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_reader-fab.scss)

On book pages (`.library-book` is in scope) the FAB surfaces extra slots;
elsewhere it shows the generic set (theme + back-to-top). Visibility is
gated to pages with reading context — landing, overview, and index pages
get neither the FAB nor a back-to-top.

## `.bookmark-btn` / Continue panel

Inline bookmark button and the slide-in panel that gathers everything a
reader can pick back up: books they're part-way through, notes they've
taken, and pages they saved for later.

**Source:**
[`themes/bifrost/sass/components/_reading-list.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_reading-list.scss)

| Class                                | What                                                              |
|--------------------------------------|-------------------------------------------------------------------|
| `.bookmark-btn`                      | Inline button that toggles whether the current entry is saved.    |
| `.reading-list-panel`                | The panel itself; opened by any `[data-toggle-reading-list]` or `Shift+B`. |
| `.reading-list-panel__group`         | One titled group — continue reading, recent notes, saved for later. |
| `.reading-list-panel__group-title`   | The group heading.                                                 |
| `.reading-list-panel__item`          | One entry — links to the page or verse, shows title and context.   |

The panel is built client-side from `localStorage`. Two scripts share it:
`reading-list.js` owns the panel and the saved-for-later group, and
`continue-reading.js` renders the in-progress and notes groups into the
`[data-continue-mount]` slot. They stay in step through a
`woh:reading-list-changed` document event, so bundle order matters —
`continue-reading.js` must load after `reading-list.js`.

`continue-reading.js` reads the library's storage keys
(`woh_library_progress`, `_history`, `_notes`) directly rather than
through `LibraryStorage`, which only ships in `library.bundle.js` and is
absent everywhere outside `/library/<book>/`. In-progress books expire
after 90 days so the count doesn't grow forever. Book slugs are shared
across locales, so deep links are rebuilt with the current locale prefix.

## `.nav-badge`

Small encircled count pinned to the corner of a nav control. Rendered on
the burger toggle, where it shows how many open reading items exist
(in-progress books plus saved pages), capped at `9+` and hidden at zero.

**Source:**
[`themes/bifrost/sass/components/_nav-badge.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_nav-badge.scss)

| Class                 | What                                              |
|-----------------------|---------------------------------------------------|
| `.nav-badge`          | The badge; hidden until JS adds the modifier.     |
| `.nav-badge--visible` | Shown — set by `continue-reading.js` when count > 0. |

Two constraints are load-bearing:

- **No transform.** The badge sits inside the navbar's `backdrop-filter`
  subtree, and WebKit drops the glass effect for any element with a
  transformed ancestor. Position with `top` / `right` only.
- **Critical-CSS gate.** The badge ships in the global chrome but is
  styled in `main.css`, so it needs an entry in the
  `html:not(.css-loaded)` block of `critical.scss` — without it the
  markup flashes as a stray "0" beside the burger icon before `main.css`
  arrives.

RTL flips the badge to the leading corner via `sass/layout/_rtl.scss`.

The distinction from the bookmark-adjacent badge
(`.reading-list-toggle__badge`) is deliberate: that one still counts only
saved pages, because it sits next to bookmark-specific labels.

## `.reading-progress`

Thin gradient bar pinned to the top of every page (long-form templates
only), updating in real time as the reader scrolls. Driven by `scripts/reading-progress.js`.

**Source:**
[`themes/bifrost/sass/components/_reading-progress.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_reading-progress.scss)

3px tall, fixed top, `z-index: 200`. Gradient runs from
`--color-accent-primary` to `--color-accent-secondary` (falling back to
the primary). Faint glow via `box-shadow`. Hidden by default; JS adds
`--visible` after the reader scrolls a few percent.

## Live examples

- **Reader FAB** — open any wiki / article / library page on a phone-width viewport.
- **Continue panel** — read a few paragraphs into any
  [library book](https://www.wheelofheaven.world/library/), bookmark an
  entry via the inline `.bookmark-btn`, then open the panel from the FAB
  or the navbar bookmark button.
- **Nav badge** — once either of the above exists, the count appears on
  the burger toggle at phone width.
- **Reading progress** — visible on any long-form page, e.g.
  [/articles/](https://www.wheelofheaven.world/articles/) (top edge, scroll-driven).

## Related

- [`back-to-top`](../../chrome/back-to-top/) — desktop counterpart to the reader FAB.
- [`study-tools`](../study-tools/) — the in-book bookmark/highlight/note toolset that the reading list lists.
