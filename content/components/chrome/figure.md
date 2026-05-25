+++
title = "Figure"
description = "Centred image block with caption — the styling target of the `figure` shortcode."
template = "page.html"
weight = 60
+++

`.figure` is the visual treatment for image+caption blocks inside article
bodies. It's small — just enough to constrain the image, round the
corners, drop a subtle shadow, and italicise the caption underneath.

**Source:**
[`themes/bifrost/sass/components/_figure.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_figure.scss)
&middot; rendered by the
[`figure` shortcode](../../shortcodes/figure/)

## Structure

```html
<figure class="figure">
    <img class="figure__image" src="…" alt="…">
    <figcaption class="figure__caption">Caption text.</figcaption>
</figure>
```

| Element             | Treatment                                                   |
|---------------------|-------------------------------------------------------------|
| `.figure`           | `margin: $spacing-xl 0`, `text-align: center`.              |
| `.figure__image`    | `max-width: 100%`, `border-radius: $border-radius-md`, `box-shadow: var(--shadow-sm)`. |
| `.figure__caption`  | `$spacing-sm` top margin, `$font-size-sm`, muted colour, italic. |

## Usage

Use the [`figure` shortcode](../../shortcodes/figure/) inside
markdown — it wraps the markup correctly and handles alt/caption args.
Don't write the `<figure>` element by hand in markdown if you can avoid
it; the shortcode keeps the contract consistent.

## Related

- [Shortcodes → `figure`](../../shortcodes/figure/) — the content-side entry point.
