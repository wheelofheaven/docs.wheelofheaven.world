+++
title = "Sharing"
description = "Two share components: `highlight-share` (text-selection popup) and `social-share` (footer share-button row)."
template = "page.html"
weight = 30
+++

Two Bifrost components handle sharing — one triggered by text selection,
one rendered as a static row.

## `.highlight-share`

Small popup that appears when the reader selects text in an article
body. Offers actions for the selection: copy, share to platforms, jump
to a permalink anchor.

**Source:**
[`themes/bifrost/sass/components/_highlight-share.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_highlight-share.scss)

| State                          | What                                                  |
|--------------------------------|-------------------------------------------------------|
| Default                        | Hidden — `opacity: 0`, `pointer-events: none`.        |
| `.highlight-share--visible`    | Visible and interactive.                              |
| `.highlight-share--below`      | Variant — popup sits below the selection (default is above). |
| `.highlight-share__arrow`      | CSS triangle pointing at the selection. Flips top/bottom with `--below`. |

JavaScript watches the `selectionchange` event, positions the popup
based on selection bounds and viewport room, and wires the action
handlers.

## `.social-share`

Static row of share buttons in article footers. No selection needed —
shares the whole page.

**Source:**
[`themes/bifrost/sass/components/_social-share.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_social-share.scss)

| Class                       | What                                              |
|-----------------------------|---------------------------------------------------|
| `.social-share`             | Flex row, label + buttons.                        |
| `.social-share__label`      | "Share" label, muted text.                        |
| `.social-share__buttons`    | Inner flex container for the buttons.             |
| `.social-share__btn`        | One button — 36×36 with rounded border + icon.    |

Hover/focus: border becomes `--color-accent-primary`, slight scale-up.

## Live examples

- **Highlight share** — select any text inside an article body.
- **Social share** — bottom of any article, e.g.
  [/articles/](https://www.wheelofheaven.world/articles/).
