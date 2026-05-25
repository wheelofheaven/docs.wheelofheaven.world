+++
title = "translation-badge"
description = "Renders the per-entry translation-status pill in the wiki sidebar — only on non-English pages with a known status."
template = "page.html"
weight = 70
+++

`macros/translation-badge.html` exposes the `render` macro that surfaces
the `page.extra.translation_status` field as a pill. Renders nothing on
English pages or when no status is set.

**Source:**
[`themes/bifrost/templates/macros/translation-badge.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/translation-badge.html)
&middot; visual surface:
[Chrome → Translation indicators](../../chrome/translation-indicators/)

## Public API

```tera
{%/* import "macros/translation-badge.html" as translation_badge */%}

{{ translation_badge::render(
    status=page.extra.translation_status | default(value=""),
    lang=detected_lang
) }}
```

## Status values

| Status            | Pill colour | When                                                            |
|-------------------|-------------|-----------------------------------------------------------------|
| `metadata_only`   | yellow      | Title + description translated; body is English.                |
| `machine`         | mauve       | Body auto-translated, awaiting human pass.                      |
| `human`           | mint        | Full human translation.                                         |
| `en_only`         | muted grey  | English fallback — no translation exists yet.                   |

## Render condition

The macro emits no markup when either:

- `lang == "en"` (English pages don't need a translation-status pill), or
- `status` is empty / unknown.

## Related

- [Chrome → Translation indicators](../../chrome/translation-indicators/) — the visual surface and the related `translation-notice` banner.
- [Contributing → Translations](../../../contributing/content/translations/) — the editorial side.
