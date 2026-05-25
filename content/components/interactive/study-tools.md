+++
title = "Study tools"
description = "Per-paragraph bookmark / highlight / note tools inside the Library book reader."
template = "page.html"
weight = 70
+++

`.study-tools` is the bookmark / highlight / note toolset that appears
beside paragraphs inside the Library book reader. It lives in the
dedicated right-gutter column on each paragraph (`.library-book__para-actions`)
so the buttons never overlap the body text.

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
fade in on paragraph hover or selection (`opacity: 0 → 1`), and stay
visible on touch where there's no hover.

## Live examples

- **Library book reader** — open any chapter, e.g.
  [/library/the-book-which-tells-the-truth/](https://www.wheelofheaven.world/library/the-book-which-tells-the-truth/),
  and hover any paragraph.

## Related

- [Reader controls → reading list](../reader-controls/) — the panel that surfaces saved bookmarks across sessions.
