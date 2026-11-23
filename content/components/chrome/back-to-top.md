+++
title = "Back-to-top"
description = "The fixed-position glass button bottom-right of long pages, jumps back to the page top on click."
template = "page.html"
weight = 70
+++

`.to-top` is the small glass button that appears bottom-right on long
pages and scrolls back to the top when clicked. Hidden by default
(`opacity: 0`, `pointer-events: none`); JavaScript reveals it after the
reader scrolls past a threshold.

**Source:**
[`themes/bifrost/sass/components/_totop.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_totop.scss)

## Anatomy

| Token                | Value                                |
|----------------------|--------------------------------------|
| Position             | `fixed`, `bottom: 1.5rem`, `right: 1.5rem` |
| Size                 | `3rem × 3rem`                        |
| Background           | `var(--color-navbar-bg)` + `backdrop-filter: blur(12px)` |
| Border               | `1px solid var(--color-border)`      |
| Radius               | `0.75rem`                            |
| z-index              | `110` (above content, below modals)  |

Hover/focus: `scale(1.05)` + brighter background. Active: `scale(0.95)`.
Visibility is JS-driven by `scripts/back-to-top.js` watching scroll
position.

## Usage

Lives in `base.html` and renders on every page — no per-template wiring
needed. The button's visibility threshold and animation timing are
defined inline.

## Live examples

Scroll any long page; the button appears bottom-right. E.g.
[/articles/](https://www.wheelofheaven.world/articles/).

## Stepping aside while reading

The floating buttons (search, back-to-top, the reader button) sit over the
right edge of the text and used to cover the ends of lines.
`static/js/fab-tuck.js` sets `body.fabs-tucked` while the page scrolls
down and clears it on any scroll up, within 400px of the top and within
240px of the end.
`sass/components/_fab-tuck.scss` hides the buttons with `opacity` and
`pointer-events` only: they are glass surfaces, and a transform on them
risks WebKit dropping their backdrop blur.
An expanded reader panel is never hidden, and keyboard focus landing on a
hidden button brings them all back.

## Target sizes

A standalone control needs at least 24 by 24 CSS pixels.
The return links in note and reference lists and the index pages' view
toggle were narrower and are brought up to size in
`sass/components/_accent-states.scss`.
Links inside a sentence are exempt, which covers the superscript note
markers.
The claim dots are 10px to look at but carry a 44px `::before` as their
tap area; keep that if you restyle them.
