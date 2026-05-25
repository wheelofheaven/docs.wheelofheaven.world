+++
title = "figure"
description = "Image + caption block with AVIF/WebP responsive sources. Inline tag, takes src / alt / caption."
template = "page.html"
weight = 60
+++

The `figure` shortcode renders an image with a caption, generating
a `<picture>` element with AVIF and WebP sources from the assets CDN.

**Source:**
[`themes/bifrost/templates/shortcodes/figure.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/figure.html)
&middot; visual surface:
[Chrome → Figure](../../chrome/figure/)

## Syntax

```markdown
{{/* figure(
    src="wiki/human-genesis",
    alt="Illustration: humanity created in laboratories.",
    caption="The Eden genome hypothesis, after Raël."
) */}}
```

| Param      | Type    | Required | Default       | What                                                  |
|------------|---------|----------|---------------|-------------------------------------------------------|
| `src`      | string  | yes      | —             | Image path relative to CDN `/images/` (no extension). Or an absolute URL. |
| `alt`      | string  | recommended | falls back to `caption` | Alt text. **Should not** be empty for non-decorative images. |
| `caption`  | string  | no       | `""`          | Caption text rendered below the image.                |

## Output

```html
<figure class="figure">
    <picture>
        <source srcset="…/wiki/human-genesis.avif" type="image/avif" sizes="(max-width: 768px) 100vw, 720px">
        <source srcset="…/wiki/human-genesis.webp" type="image/webp" sizes="(max-width: 768px) 100vw, 720px">
        <img src="…/wiki/human-genesis.webp" alt="…" class="figure__image" loading="lazy" decoding="async">
    </picture>
    <figcaption class="figure__caption">…</figcaption>
</figure>
```

## CDN

Reads `config.extra.cdn_url`. Image URLs that start with `http` bypass
the CDN prefix and are used verbatim — useful for embedding external
images, but prefer the CDN for project-controlled assets.

## Related

- [Chrome → Figure](../../chrome/figure/) — `.figure` / `.figure__image` / `.figure__caption` styling.
- [Macros → image](../../macros/image/) — the template-side equivalent for non-markdown contexts.
