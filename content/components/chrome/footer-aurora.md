+++
title = "Footer aurora"
description = "The footer's rainbow as a WebGL aurora: what it draws, when it runs, how it falls back, and the numbers to change when tuning it."
template = "page.html"
weight = 95
+++

The site footer ends in a rainbow band.
Where the browser supports WebGL and the visitor has not asked for reduced
motion, that band is drawn as an aurora: three curtains of light rising
from a solid glow at the bottom edge, pleated into rays that run up behind
the footer's links and fade to nothing at the top.

**Source:**
[`static/js/footer-aurora.js`](https://github.com/wheelofheaven/bifrost/blob/main/static/js/footer-aurora.js)
(part of `core.bundle.js`)
· [`sass/layout/_footer.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/layout/_footer.scss)

## Two layers

1. **The CSS band** (`.footer__rainbow`) is always in the page: a linear
   gradient of the palette's 300 band that pans slowly, masked so it fades
   in from the top, under a film-grain overlay. It needs no script.
2. **The canvas** (`.footer__aurora`) is created by the script and laid
   behind the whole footer. When it is drawing, the footer gets
   `.footer--aurora`, which turns the CSS band's gradient and pan off. The
   strip keeps its height, so nothing moves when the canvas takes over.

If the script never runs, fails to get a WebGL context, loses the context,
or the visitor turns reduced motion on, the canvas is removed and the CSS
band is what remains.

## Cost

- Nothing is created until the footer is within 800px of the viewport.
- The canvas renders at half the CSS resolution and never more than
  420,000 pixels; a phone footer is several screens tall.
- It draws about 30 frames a second and stops when the footer is off
  screen or the tab is hidden.

## Colour

The seven hues are parsed from the theme's `--accent-rainbow` token, so
the aurora follows the light/dark toggle and the palette has one source.
On the light theme the band is deeper (the 500 band), so the aurora is
drawn at 72% strength there to stay a wash.

## Tuning

All of these are in the fragment shader or just above it in
`footer-aurora.js`.
Rebuild the bundle (`npm run bundle`) after changing them.

| What | Where | Now |
|---|---|---|
| Overall size of folds and curtains | `uUnit * vec2(1.8, 1.4)` in `main()` | 1.8 wide, 1.4 tall |
| How far the hems sway | the two `sin` terms of `hem` | 0.15 and 0.07 |
| Sideways travel of the folds | `uTime * 0.24` in `folds` | 0.24 |
| The passing swell of brightness | `swell` | depth 0.26, speed 0.38 |
| Strength of the veil behind the links | `veil` | 0.34, falling with height |
| Hue drift | `uTime * 0.02` in `hue` | 0.02 |
| Strength on the light theme | `retheme()` | 0.72 |
| Pixel ceiling | `PIXEL_BUDGET` | 420000 |

Keep the footer's content above the canvas: every direct child of
`.footer--aurora` except the canvas is given `position: relative;
z-index: 1`.
The canvas follows the footer's rounded top corners with
`border-radius: inherit`; the footer itself is not clipped, because its
language menu opens upward.

## Checking a change

Screenshots taken a few seconds apart can come back identical in headless
Chrome even when the animation runs.
To confirm motion, count `drawArrays` calls or read pixels after a draw.
Check on a real phone before shipping a change that raises the pixel
budget or the frame rate.
