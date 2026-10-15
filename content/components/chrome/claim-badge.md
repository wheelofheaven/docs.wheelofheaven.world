+++
title = "Claim badge"
description = "Epistemic-status pill set sitting beside page titles — direct, framework, inferred, speculative. The page's own claim_type is highlighted; siblings collapse to one character and tuck behind it as a single stacked element."
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
| `.claim-badges`                | `inline-flex`, never wraps. Rendered **stacked** as one element: the active badge on top with its full label, the inactive letters tucked half behind it (`margin-left: -0.5rem`, opaque discs). Hover or keyboard focus fans the pills out to normal spacing. |
| `.claim-badges--open`          | Fanned-out state set by JS on the first tap on touch screens (mouse and keyboard fan out via `:hover` / `:focus-visible`). Cleared by an outside tap or Escape. |
| `.claim-badge`                 | One badge. Collapsed by default to a single character (`.claim-badge__char`); expands to the full label (`.claim-badge__rest`) via `max-width` animation. |
| `.claim-badge--active`         | The badge matching `page.extra.claim_type`. Rendered expanded in its accent colour; while stacked it is painted on an opaque base (`--badge-tint` gradient over the page background) so tucked letters never show through its translucent tint. |
| `.claim-badge--expanded`       | Pinned-open via JS click. Persists until clicked again. |
| `.claim-badge--tooltip-open`   | Glassmorphic tooltip explaining the claim type is visible. |
| `:has()` rule                  | When any sibling inactive is hovered or pinned, the active collapses so only one expanded badge is ever on screen. Modern browsers only — falls back gracefully (active stays expanded next to the hovered one). |

The row is driven by `static/js/claim-badge.js` (in the core bundle), the
same on every page type.

- **Mouse / trackpad** (`@media (hover: hover)`): hovering fans the stack
  out; hovering a letter expands it in place; a click pins it, a second
  click opens its tooltip.
- **Keyboard**: `:focus-visible` fans out and expands the focused badge
  and shows its tooltip.
- **Touch**: hover effects are disabled (touch browsers keep a sticky
  emulated `:hover` that made the row reflow under the finger and loop).
  The first tap fans the stack out; a tap on a badge toggles its tooltip,
  whose title names the full type — no pill widens, so the row never
  reflows. Outside tap or Escape closes everything.
- Hovering an inactive letter never collapses the active badge (that shift
  slid the hovered letter out from under the pointer); only a pinned
  (`--expanded`) or keyboard-focused letter does.
- Tooltips wrap (`white-space: normal`), cap at `min(16rem, 100vw - 1rem)`,
  and are nudged back inside the viewport by JS when they open.

Without JS the stack still fans out on hover/focus, and the active badge
reads in full.
The legend variant (`.claim-badges--legend`, landing "The Method") is not
stacked.

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
