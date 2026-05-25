+++
title = "Reader controls"
description = "Mobile floating action button (`reader-fab`), bookmark list (`reading-list`), and scroll progress bar (`reading-progress`)."
template = "page.html"
weight = 20
+++

Three Bifrost components compose the reader's control surface on long
content pages. They're documented together because they share a single
mental model: tools that help a reader navigate a long page on a small
screen.

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

## `.bookmark-btn` / reading list

Inline bookmark button and the reading-list panel that holds saved
entries.

**Source:**
[`themes/bifrost/sass/components/_reading-list.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_reading-list.scss)

| Class                | What                                                            |
|----------------------|-----------------------------------------------------------------|
| `.bookmark-btn`      | Inline button that toggles whether the current entry is saved.  |
| `.reading-list`      | The panel that lists saved entries; opened from the FAB or navbar. |
| `.reading-list__item`| One saved entry — links to the page, shows the title and section. |

Bookmark state is stored in `localStorage`; the panel renders the list
client-side on open.

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
- **Reading list** — bookmark a few entries via the inline `.bookmark-btn`,
  then open the panel from the FAB.
- **Reading progress** — visible on any long-form page, e.g.
  [/articles/](https://www.wheelofheaven.world/articles/) (top edge, scroll-driven).

## Related

- [`back-to-top`](../../chrome/back-to-top/) — desktop counterpart to the reader FAB.
- [`study-tools`](../study-tools/) — the in-book bookmark/highlight/note toolset that the reading list lists.
