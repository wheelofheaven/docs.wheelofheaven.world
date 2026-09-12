+++
title = "Related content"
description = "The 'Read next' suggestions block that appears at the end of article and wiki bodies."
template = "page.html"
weight = 40
+++

`.related-content` is the "Read next" suggestions block that sits at the
end of long-form pages. It renders as just another article section —
same horizontal padding as the body and references blocks, so the left
edge aligns visually.

**Source:**
[`themes/bifrost/sass/components/_related-content.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_related-content.scss)
&middot; rendered by
[`templates/partials/related-content.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/related-content.html)

## Anatomy

| Class                            | What                                                       |
|----------------------------------|------------------------------------------------------------|
| `.related-content`               | Container — top margin, body padding.                      |
| `.related-content__title`        | "Read next" header — `font-family-lead`, hairline underline. |
| `.related-content__icon`         | Inline icon next to the title.                             |
| `.related-content__grid`         | Two- or three-up grid of suggestion cards.                 |
| `.related-content__item`         | One suggestion card — built on `.card`.                    |

The list is precomputed at build time by `scripts/build_related.py` in
the site repo (`mise run related`, also run by `mise run build`), which
writes one `data/related/<lang>.json` per locale keyed by page path. The
rule: siblings in the same section that share the page's `extra.category`
come first, then the next siblings in section order, up to four. The
partial only looks its page up in that file. It used to call
`get_section()` and scan the section's pages for every page, which made
Zola serialise the whole section (every page with its rendered HTML) on
each call and cost about half of the site's build time. Clients see a
static set, no JS round-trips.

## Live examples

Bottom of any wiki entry, e.g.
[/wiki/elohim/](https://www.wheelofheaven.world/wiki/elohim/), or any
article.

## Related

- [`card`](../card/) — the primitive each item is built on.
