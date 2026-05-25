+++
title = "Section mark"
description = "Section identity glyph — sits next to an h1 in overview headers and next to card titles for subcategory marks. Sized in em so it scales with the heading."
template = "page.html"
weight = 40
+++

`.section-mark` is the small identity glyph that appears next to section
titles and card titles to mark which part of the site you're in. The
icon itself comes from the [icon registry](../../../reference/icons/);
the SCSS just handles sizing and colour.

**Source:**
[`themes/bifrost/sass/components/_section-mark.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_section-mark.scss)
&middot; icons rendered by
[`templates/macros/section-icons.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/section-icons.html)

## Anatomy

| Variant            | Size              | Colour                       | Use                                     |
|--------------------|-------------------|------------------------------|-----------------------------------------|
| Default            | `1.5em × 1.5em`   | `var(--color-text-muted)`    | Inline next to card titles, subcategory marks. |
| `.section-mark--hero` | `2.5rem × 2.5rem` | `var(--color-text)`        | Overview headers — full-strength colour, fixed pixel size. |

Sized in `em` (default) so it tracks the surrounding font-size and
visually balances with whatever heading it sits next to. Uses
`currentColor` so it inherits the link / heading colour automatically.

## Usage

Pair with the `section-icons` macro to render a registered icon by id
or by semantic slug:

```tera
{%/* import "macros/section-icons.html" as section_icons */%}
…
<h1>
    <span class="section-mark section-mark--hero">
        {{ section_icons::section(slug="wiki") }}
    </span>
    Wiki
</h1>
```

## Tokens

| CSS variable               | What it does                                |
|----------------------------|---------------------------------------------|
| `--color-text-muted`       | Default-variant colour (recedes from the heading). |
| `--color-text`             | `--hero` variant colour (full strength).    |

## Live examples

- **Section landings** — `/wiki/`, `/timeline/`, `/articles/`, `/news/`,
  `/library/`, `/read/` all show the hero variant in their h1.
- **Cards** — subcategory marks appear next to card titles in section
  index grids.

## Related

- [Macros → `section-icons`](../../macros/section-icons/) — the resolver macros (`section`, `tradition`, `event_type`, `render`).
- [Icon registry](../../../reference/icons/) — every icon catalogued, with slug bindings.
