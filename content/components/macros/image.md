+++
title = "image"
description = "Responsive `<picture>` element generator targeting AVIF and WebP sources on the assets CDN."
template = "page.html"
weight = 80
+++

`macros/image.html` is the canonical way to render images on
`www.wheelofheaven.world`. The `cdn` macro emits a `<picture>` element
with AVIF + WebP sources fetched from `assets.wheelofheaven.world`, with
sensible defaults for sizing and lazy loading.

**Source:**
[`themes/bifrost/templates/macros/image.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/image.html)
&middot; CDN: [`assets.wheelofheaven.world`](https://assets.wheelofheaven.world)

## Public API

```tera
{%/* import "macros/image.html" as img */%}

{{ img::cdn(path="wiki/human-genesis", alt="Human Genesis illustration") }}

{{ img::cdn(
    path="timeline/equinox_1945",
    alt="Equinox 1945",
    class="hero-image",
    lazy=true
) }}

{{ img::cdn(
    path="library/le-message-book",
    alt="Le Message book cover",
    sizes="(max-width: 768px) 100vw, 50vw"
) }}
```

## Parameters

| Param      | Type    | Required | Default       | What                                              |
|------------|---------|----------|---------------|---------------------------------------------------|
| `path`     | string  | yes      | —             | Image path relative to CDN `/images/` (no extension). |
| `alt`      | string  | yes      | —             | Alt text. **Required** for accessibility.         |
| `class`    | string  | no       | `""`          | Optional CSS class(es).                           |
| `lazy`     | bool    | no       | `false`       | If `true`, `loading="lazy"` + shows thumbnail first. |
| `sizes`    | string  | no       | `"100vw"`     | Responsive `sizes` attribute.                     |
| `width`    | string  | no       | `""`          | Optional `width` attribute.                       |
| `height`   | string  | no       | `""`          | Optional `height` attribute.                      |

## CDN base URL

Pulled from `config.extra.cdn_url`, falling back to
`https://assets.wheelofheaven.world`. The macro never hardcodes the CDN.

## Why this is a macro

`<picture>` elements with AVIF + WebP sources are too verbose to write
manually in every template. Centralising the pattern in one macro means:

- Adding a new format (e.g. JPEG XL) is one edit.
- Switching CDN provider is one config change.
- Lazy-loading defaults can be tuned globally.

## Related

- [`figure` shortcode](../../shortcodes/figure/) — the markdown-facing wrapper that uses this macro under the hood.
- [Chrome → Figure](../../chrome/figure/) — the visual surface around figures.
