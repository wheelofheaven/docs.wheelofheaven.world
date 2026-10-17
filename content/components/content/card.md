+++
title = "Card"
description = "The generic content card primitive — used for index grids, related-content tiles, and the base of more specialised card types."
template = "page.html"
weight = 10
+++

`.card` is Bifrost's generic card primitive — a bordered, rounded, lightly
shadowed block with hover lift. It's the visual foundation for most index
grids and related-content tiles across the site.

**Source:**
[`themes/bifrost/sass/components/_card.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_card.scss)

## Anatomy

| Token              | Value                                                  |
|--------------------|--------------------------------------------------------|
| Background         | `var(--color-card-bg)`                                 |
| Border             | `1px solid var(--color-border)`                        |
| Radius             | `0.75rem`                                              |
| Padding            | `1.5rem`                                               |
| Shadow             | `0 1px 3px rgba(0,0,0,0.1)` + `0 1px 2px rgba(0,0,0,0.06)` |
| Hover              | `translateY(-2px)`, deeper shadow, border `--color-border-strong`. |

| Element            | What                                                   |
|--------------------|--------------------------------------------------------|
| `.card__header`    | Optional. Bottom-padded, hairline border underneath.   |
| `.card__title`     | Title-row text.                                        |
| `.card__body`      | Main content.                                          |
| `.card__footer`    | Meta row at the bottom.                                |

## When NOT to use this

For **premium / lead** cards (lead Article on `/articles/`, lead Dispatch
on `/news/`, reading-path tiles on `/read/`) use
[`glass-cloud-card`](../../visual-language/glass-cloud-card/) instead. The
generic `.card` is for index tiles and uniform grids where prominence is
spread evenly.

## Summary length

Article cards, including the lead card, prefer `extra.card_summary`, then
`description`, then `extra.summary`. Prefer one or two concise sentences
that tell readers what the article examines. Full abstracts remain on the
article itself. Card summaries are visually limited to four lines.

The October 2026 consistency pass added dedicated summaries to the 28
English Explainers. Translated cards use their own localized description
unless a localized `extra.card_summary` is supplied.

Library descriptions are no longer cut at an arbitrary character count.
Their complete text remains in the markup; normal cards show up to four
lines and featured cards up to three. This avoids stored excerpts ending
mid-word, while the book page provides the full description.

## Live examples

- **Wiki index grid** — [/wiki/](https://www.wheelofheaven.world/wiki/) tiles.
- **Timeline index** — [/timeline/](https://www.wheelofheaven.world/timeline/) age cards.
- **Resources** — [/resources/](https://www.wheelofheaven.world/resources/) entries.

## Related

- [`glass-cloud-card`](../../visual-language/glass-cloud-card/) — the premium counterpart for lead positions.
