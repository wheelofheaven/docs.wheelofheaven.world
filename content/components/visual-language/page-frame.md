+++
title = "Page frame"
description = "One geometry for every page type: the navbar's frame, a 44rem reading measure, the title at the same edge and height everywhere, and the breadcrumb in the footer."
template = "page.html"
weight = 6
+++

Since 2026-11-07 every page type sits on one frame. An audit of 32 page
types at 1440 and 390 px had found the title edge at eleven x positions on
desktop (91–356 px) and nine on phones (24–116 px), the first line of the
page anywhere from 136 to 174 px down, three headline sizes and two
weights — every template centred its own container at its own max-width.

**Source:**
[`sass/pages/_frame.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/pages/_frame.scss)
(loaded last) · [`sass/pages/_reading-polish.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/pages/_reading-polish.scss)

## The rules

| | Desktop (≥ 1025 px) | Phones |
|---|---|---|
| **Frame** | the navbar's: `min(80rem, 90vw)`, centred | `main` 0.75rem + container 0.75rem |
| **Text edge** | under the navbar logo (91 px at 1440) | 1.5rem (29 px at 390) — also the logo's edge |
| **Side column** | ends at the navbar's right edge | after the content, full width |
| **Reading measure** | 44rem, left-aligned on the frame edge | full width |
| **First line** | header `padding-top: 2.25rem` below `main`'s top (140 px at 1440) | 147 px at 390 |
| **Headline** | `grammar-headline`, `clamp(2.25rem, 4.2vw, 3.5rem)`, weight 500 | same |
| **Index header** | title, lede, rainbow dash; left-aligned; no hero section glyph | same |
| **Breadcrumb** | footer brand column ([Breadcrumbs](../../chrome/breadcrumbs/)) | same |
| **Side panels** | wiki / timeline / library asides: no fill, no border — a column of the page | same |

Templates on the frame: about, info pages, FAQ, contact, author,
contributors (index + page), articles and newsroom (index + page), wiki
(index + page), library (index + book), timeline ages, sources (index +
record), tradition hubs (index + hub), datasets (index + page), read,
listen, gallery, offline, 404, graph.

Deliberately not on it — full-bleed, cinematic pages: the home page, the
timeline landing, `/timeline/chronology/`, and the map.

Hero styles retired with it: the contact page's banner box, gradient card
and gradient button; the offline and 404 centred heroes. The 404 page now
extends `base.html` (navbar, footer, theme) and stays `noindex`.

## Checking a change

The audit harness measures every page type's h1 edge, top, size and weight
and builds contact sheets of all of them at both widths. Re-run it after
any change to page chrome: a page that is off by a few pixels shows up in
the numbers before anyone sees it.

## Related

- [Reading grammar](../reading-grammar/) — the typographic grammar inside the frame.
- [chrome-glass](../chrome-glass/)
