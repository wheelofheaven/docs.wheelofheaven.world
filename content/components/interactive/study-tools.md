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

On screens below 1000px, opening My Study Notes hides the floating search,
reader-options, and back-to-top controls so they cannot cover Import or
Export.
The panel follows dynamic viewport height and safe-area insets; in short
landscape windows it uses the available height with a smaller top inset.
Its close button has a 44px touch target and its note list scrolls
independently without passing scroll gestures to the book.

## Mobile note editor

Below 1000px, adding or editing a personal note opens a full-screen native
modal dialog, with the paragraph reference and book title at the top.
The passage pane and note field scroll independently.
The footer keeps Save and Delete reachable without scrolling through the
passage or the note.
Published editorial Notes remain separate from these personal notes.

Opening the editor focuses Close rather than summoning the phone keyboard.
The dialog follows `visualViewport` height and offsets when the keyboard
opens and when the phone rotates, with safe-area padding for screen edges.
The background book is inert and its reading position is restored on close.
Keyboard shortcuts for the underlying reader do not run inside the dialog.

Closing with unsaved edits offers Keep editing or Discard changes.
Deleting an existing note also requires an explicit confirmation inside the
editor.
If browser storage fails, the text stays in the editor with an error.
Notes use the existing storage and export format; the desktop inline editor
is preserved.
Editing from My Study Notes returns to that list without jumping the book
to the paragraph first.

## Live examples

- **Library book reader** — open any chapter, e.g.
  [/library/the-book-which-tells-the-truth/](https://www.wheelofheaven.world/library/the-book-which-tells-the-truth/),
  and hover any paragraph.

## Related

- [Reader controls → Continue panel](../reader-controls/) — the panel that surfaces these notes and bookmarks across sessions, from anywhere on the site.
