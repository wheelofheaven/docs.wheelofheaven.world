+++
title = "Study tools"
description = "Per-paragraph bookmark / highlight / note tools inside the Library book reader."
template = "page.html"
weight = 70
+++

`.study-tools` is the bookmark / highlight / note toolset that appears
beside paragraphs inside the Library book reader. Its buttons live in a
floating action pill (`.library-book__para-actions`) at the selected
paragraph's lower edge, without reserving a column of text width.

**Source:**
[`themes/bifrost/sass/components/_study-tools.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_study-tools.scss)

| Class                            | What                                                            |
|----------------------------------|-----------------------------------------------------------------|
| `.study-tools__para-toolbar`     | The horizontal row of small icon buttons for a paragraph.       |
| `.study-tools__btn`              | One button — 1.75rem square, hairline border, tooltip on hover.  |
| `.study-tools__btn--bookmark`    | Bookmark toggle.                                                |
| `.study-tools__btn--highlight`   | Highlight on/off + colour picker.                               |
| `.study-tools__btn--note`        | Note editor trigger.                                            |

Visibility is gated by the parent `.library-book__para-actions` — buttons
appear on paragraph selection (`opacity: 0 → 1`).

On phones up to 600px, selection uses a short 1px marker at 35% accent
opacity, with no paragraph background fill. Audio playback keeps its
distinct highlight. Paragraph numbers and speaker portraits remain in
the narrow gutter, at their existing sizes.
Book pages up to 900px use one layer of horizontal padding, owned by the
article; phones use a 0.625rem inset. The shared `main` padding must not
add another inset around the reader.

Per-paragraph Notes popovers use `chrome-glass` with `--color-menu-bg`,
including its reduced-transparency and unsupported-blur fallbacks.
The panel and its ancestors must remain transform-free for iOS blur.
On phones the popover fits the paragraph width and scrolls within 70dvh.

## Live examples

- **Library book reader** — open any chapter, e.g.
  [/library/the-book-which-tells-the-truth/](https://www.wheelofheaven.world/library/the-book-which-tells-the-truth/),
  and hover any paragraph.

## Related

- [Reader controls → Continue panel](../reader-controls/) — the panel that surfaces these notes and bookmarks across sessions, from anywhere on the site.
