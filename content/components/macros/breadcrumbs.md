+++
title = "breadcrumbs"
description = "Render breadcrumb navigation with schema.org BreadcrumbList markup. One convenience macro per section type."
template = "page.html"
weight = 10
+++

`macros/breadcrumbs.html` renders the breadcrumb navigation row at the
top of every interior page. Each Wheel of Heaven section has its own
convenience macro so the breadcrumb structure stays consistent (Home →
section → category → page) without per-template duplication.

**Source:**
[`themes/bifrost/templates/macros/breadcrumbs.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/breadcrumbs.html)
&middot; visual surface:
[`.breadcrumbs`](../../chrome/breadcrumbs/)

## Public API

```tera
{%/* import "macros/breadcrumbs.html" as breadcrumbs */%}

{{ breadcrumbs::wiki(page=page, lang=detected_lang) }}
{{ breadcrumbs::timeline(page=page, lang=detected_lang) }}
{{ breadcrumbs::library(page=page, lang=detected_lang) }}
{{ breadcrumbs::article(page=page, lang=detected_lang) }}
{{ breadcrumbs::news(page=page, lang=detected_lang) }}
{{ breadcrumbs::resources(page=page, lang=detected_lang) }}
…
```

## Parameters (common to all variants)

| Param   | Type            | Required | Default | What                                      |
|---------|-----------------|----------|---------|-------------------------------------------|
| `page`  | Tera page       | yes      | —       | The current page object.                  |
| `lang`  | string          | no       | `"en"`  | Language code (use `detected_lang`).      |

## Markup

Each macro emits a `<nav class="breadcrumbs" aria-label="Breadcrumb">`
with schema.org `BreadcrumbList` markup: every item is an
`itemListElement` with `position`, `name`, and `item` properties so
Google can extract the trail for SERP enhancements.

The home link uses the brand logomark; section links use the
[`section-icons`](section-icons/) glyph next to the section name.

## Related

- [Chrome → Breadcrumbs](../../chrome/breadcrumbs/) — the visual surface.
- [`section-icons`](section-icons/) — the glyph next to each section link.
