+++
title = "link"
description = "i18n-aware link with auto external-detection — drop-in alternative to a markdown link when you need language-prefix resolution."
template = "page.html"
weight = 70
+++

The `link` shortcode is an i18n-aware link renderer with automatic
external-detection. Use it inside markdown when you want a link that
resolves to the current language prefix automatically — particularly
useful for footer rows and cross-section navigation.

**Source:**
[`themes/bifrost/templates/shortcodes/link.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/link.html)

## Syntax

```markdown
{{/* link(url="wiki/elohim/", text="Elohim") */}}
{{/* link(url="https://example.com", text="External", title="External resource") */}}
```

| Param    | Type    | Required | Default | What                                                            |
|----------|---------|----------|---------|-----------------------------------------------------------------|
| `url`    | string  | yes      | —       | Internal path or absolute URL.                                  |
| `text`   | string  | yes      | —       | Link label.                                                     |
| `title`  | string  | no       | `""`    | Optional `title` attribute.                                     |
| `class`  | string  | no       | `""`    | Optional CSS class(es).                                         |
| `target` | string  | no       | `""`    | Override the auto-detected target.                              |

## External detection

URLs that start with `http://` or `https://` and don't contain
`config.base_url` are flagged external — adds `target="_blank"`,
`rel="noopener noreferrer"`, and a `↗` indicator after the link text.

## i18n behaviour

When the current page is non-default-language and the link is internal:
- relative paths (no leading `/`) get a `/<lang>/` prefix
- absolute paths get a `/<lang>` prefix unless already language-prefixed

The default language never gets a prefix (canonical paths stay clean
on English pages).

## When to use this vs `wiki`

| Linking to…                  | Use                                              |
|------------------------------|--------------------------------------------------|
| A wiki entry                 | [`wiki`](../wiki/) — gets `.wikilink` styling + tooltip integration. |
| A specific Library book quote| [`library`](../library/) — paired-tag with deep-link + CTA. |
| Anywhere else (internal or external) | `link` — generic. |
| Plain markdown when you don't care about i18n | A markdown link `[text](url)`. |
