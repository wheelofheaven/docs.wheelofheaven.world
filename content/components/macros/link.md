+++
title = "link"
description = "Two link-render macros: `smart_link` (auto-detects external) and `footer_link` (internal i18n)."
template = "page.html"
weight = 90
+++

`macros/link.html` exposes two link-render helpers that handle external-
vs-internal detection and i18n consistently across the site.

**Source:**
[`themes/bifrost/templates/macros/link.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/link.html)

## `smart_link`

Renders a link with an external-indicator arrow (`↗`) appended when the
URL is off-site.

```tera
{%/* import "macros/link.html" as link */%}

{{ link::smart_link(
    url="https://example.com",
    text="External resource",
    title="…",
    class="…",
    target=""
) }}
```

External detection: URLs that start with `http://` or `https://` and
don't contain `beta.wheelofheaven.` are flagged external — adds
`target="_blank"`, `rel="noopener noreferrer"`, and the indicator arrow.

## `footer_link`

For footer rows. Resolves internal paths against the current language
prefix so a link to `wiki/` becomes `/de/wiki/` on German pages.

```tera
{{ link::footer_link(
    url="wiki/",
    text=trans(key="navbarWiki", lang=detected_lang),
    title="",
    class="footer-link"
) }}
```

| Param    | Type   | Default | What                                                      |
|----------|--------|---------|-----------------------------------------------------------|
| `url`    | string | —       | Internal path or absolute URL.                            |
| `text`   | string | —       | Link label.                                               |
| `title`  | string | `""`    | Optional `title` attribute.                               |
| `class`  | string | `""`    | Optional CSS class(es).                                   |
| `target` | string | `""`    | Override the auto-detected target.                        |
