+++
title = "Category rail"
description = "Horizontal scroll-snap rail of category tiles — traditions on /library/, categories on /wiki/, reading paths on /read/."
template = "page.html"
weight = 50
+++

`.category-rail` is the horizontal scroll-snap showcase that sits near
the top of section indexes — traditions on /library/, categories on
/wiki/, reading paths on /read/. Each tile carries an icon, a label,
and an optional count; clicking jumps the reader into the matching
filtered view.

**Source:**
[`themes/bifrost/sass/components/_category-rail.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_category-rail.scss)

## Anatomy

| Class                            | What                                                       |
|----------------------------------|------------------------------------------------------------|
| `.category-rail`                 | Container — top + bottom margin (`$spacing-xl 0 $spacing-2xl`). |
| `.category-rail__header`         | Title row with optional "see all" link.                     |
| `.category-rail__title`          | `font-family-lead`, prominent heading.                      |
| `.category-rail__track`          | Scroll-snap horizontal flex container.                      |
| `.category-rail__tile`           | One tile — built on [`glass-cloud-card`](../../visual-language/glass-cloud-card/). |
| `.category-rail__arrows`         | Desktop-only prev/next nav.                                 |

| Behaviour              | What                                                            |
|------------------------|-----------------------------------------------------------------|
| Touch                  | Native horizontal swipe.                                        |
| Desktop                | Two arrows (prev / next) advance one viewport at a time.        |
| Autoplay               | None. The rail is reader-driven.                                |
| Scrollbar              | Hidden (`scrollbar-width: none`, `::-webkit-scrollbar`).         |
| Snap                   | Mandatory, snap-start on every tile.                            |

## Live examples

- **Library traditions rail** — [/library/](https://www.wheelofheaven.world/library/) top of page.
- **Wiki categories rail** — [/wiki/](https://www.wheelofheaven.world/wiki/) top of page.
- **Reading paths rail** — [/read/](https://www.wheelofheaven.world/read/) top of page.

## Related

- [`glass-cloud-card`](../../visual-language/glass-cloud-card/) — the recipe each tile is built on.
- [`section-mark`](../../chrome/section-mark/) — the identity glyph each tile carries.
