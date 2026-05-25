+++
title = "Claim badge"
description = "Epistemic-status pill set sitting beside page titles — direct, framework, inferred, speculative. The page's own claim_type is highlighted; siblings collapse to one character."
template = "page.html"
weight = 20
+++

The claim-badge row shows the four
[claim types](../../../contributing/content/) that Wheel of Heaven
content is classified under, with the page's own `claim_type` highlighted
in its accent colour. The row is the visual surface of decision #11 in
Strategy 3 / Phase 2: every page declares the epistemic status of its
main argument.

**Source:**
[`themes/bifrost/sass/components/_claim-badge.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_claim-badge.scss)
&middot;
[`themes/bifrost/templates/macros/claim-badge.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/claim-badge.html)

## Anatomy

| Layer                          | What it does                                                       |
|--------------------------------|--------------------------------------------------------------------|
| `.claim-badges`                | `inline-flex`, never wraps — the four badges always sit on one row. |
| `.claim-badge`                 | One badge. Collapsed by default to a single character (`.claim-badge__char`); expands to the full label (`.claim-badge__rest`) via `max-width` animation. |
| `.claim-badge--active`         | The badge matching `page.extra.claim_type`. Rendered expanded in its accent colour. |
| `.claim-badge--expanded`       | Pinned-open via JS click. Persists until clicked again. |
| `.claim-badge--tooltip-open`   | Glassmorphic tooltip explaining the claim type is visible. |
| `:has()` rule                  | When any sibling inactive is hovered or pinned, the active collapses so only one expanded badge is ever on screen. Modern browsers only — falls back gracefully (active stays expanded next to the hovered one). |

The row is driven by JavaScript in `wiki-page.html` (and the equivalent
template for each section). Without JS the static fallback shows the
active badge already-expanded and the rest as single characters — still
readable.

## Colors

| Claim type    | Accent (Bifrost palette) | Reading                                                 |
|---------------|--------------------------|---------------------------------------------------------|
| `direct`      | `$cyan-300`              | Claim is explicit in a primary source, or directly verifiable. |
| `framework`   | `$mauve-300`             | A modelling claim about the WoH frame itself.           |
| `inferred`    | `$yellow-300`            | Reasonable reading of a source, not literally stated.   |
| `speculative` | `$lavender-300`          | Interpretive synthesis going beyond what any source states. |

## Usage

Don't compose the row manually. Use the macro:

```tera
{%/* import "macros/claim-badge.html" as claim_badge */%}
…
{{ claim_badge::render(claim_type=page.extra.claim_type) }}
```

The macro picks up `page.extra.claim_type` from frontmatter and renders
the full four-badge row with the right one marked active.

## Live examples

Claim badges render in the header of every wiki and explainer page. E.g.
[/wiki/elohim/](https://www.wheelofheaven.world/wiki/elohim/) (`direct`),
[/articles/](https://www.wheelofheaven.world/articles/) (varies).

## Related

- [Macros → `claim-badge`](../../macros/claim-badge/) — the macro that renders the row.
- [Contributing → Claim types](../../../contributing/content/) — the editorial taxonomy this badge surfaces.
