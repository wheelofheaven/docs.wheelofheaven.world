+++
title = "Dispatch chip"
description = "The mint pill labelling content as a Newsroom Dispatch. Distinct from claim-badge and section accents."
template = "page.html"
weight = 30
+++

`.dispatch-chip` is the small pill that labels Newsroom Dispatch entries
as such. Mint-coloured by deliberate choice — distinct from the
[claim badge](../claim-badge/) palette (cyan / mauve / yellow / lavender)
and from Bifrost's per-section accents.

**Source:**
[`themes/bifrost/sass/components/_dispatch-chip.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_dispatch-chip.scss)
&middot; rendered by
[`templates/macros/dispatch.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/dispatch.html)

## Anatomy

| Token                  | Value                                |
|------------------------|--------------------------------------|
| Background             | `c.$mint-100`                        |
| Border                 | `1px solid c.$mint-300`              |
| Text                   | `c.$mint-800`                        |
| Padding                | `0.25rem 0.625rem`                   |
| Radius                 | `border-radius-full` (pill)          |
| Font                   | `font-size-xs`, weight 600, uppercase, letter-spacing `0.04em` |

`white-space: nowrap` so the label never wraps; `user-select: none` so
double-clicking the chip doesn't select it.

## Usage

Don't write the markup manually. The
[`dispatch` macro](../../macros/dispatch/) renders dispatches into list
contexts, including the chip:

```tera
{%/* import "macros/dispatch.html" as dispatch */%}
…
{{ dispatch::card(page=page, lang=detected_lang) }}
```

The chip itself, if you need it standalone:

```html
<span class="dispatch-chip">Dispatch</span>
```

## Live examples

- **/news/ index** — every Dispatch card shows the chip in its header:
  [www.wheelofheaven.world/news/](https://www.wheelofheaven.world/news/)
- **Individual Dispatch pages** — chip appears next to the title.

## Related

- [Macros → `dispatch`](../../macros/dispatch/) — the macro that wraps the chip + the rest of a Dispatch card.
- [Claim badge](../claim-badge/) — the orthogonal epistemic-status pills (a Dispatch carries both a claim badge and a dispatch chip).
