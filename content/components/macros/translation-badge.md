+++
title = "translation-badge"
description = "Renders the per-entry translation-status pill, with freshness dates and a may-lag marker, on translated wiki, article, timeline and news pages."
template = "page.html"
weight = 70
+++

`macros/translation-badge.html` exposes the `render` macro that surfaces
the `page.extra.translation_status` field as a pill, with the translation's
freshness in the tooltip. Renders nothing on English pages or when no status
is set. Placed in the wiki sidebar, the article and dispatch bylines, and the
timeline-chapter meta column.

**Source:**
[`themes/bifrost/templates/macros/translation-badge.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/translation-badge.html)
&middot; visual surface:
[Chrome → Translation indicators](../../chrome/translation-indicators/)

## Public API

```tera
{%/* import "macros/translation-badge.html" as translation_badge */%}

{{ translation_badge::render(
    status=page.extra.translation_status | default(value=""),
    lang=detected_lang,
    updated=page.extra.translation_updated | default(value=""),
    source=page.extra.source_updated | default(value=""),
    stale=page.extra.translation_stale | default(value=false),
    sync=page.extra.translation_sync | default(value=100)
) }}
```

The four freshness parameters are optional; without them the macro renders
the plain status pill as before.

## Status values

| Status            | Pill colour | When                                                            |
|-------------------|-------------|-----------------------------------------------------------------|
| `metadata_only`   | yellow      | Title + description translated; body is English.                |
| `machine`         | mauve       | Body auto-translated, awaiting human pass.                      |
| `ai_reviewed`     | teal        | AI-translated, then independently reviewed against the English and the canon. |
| `human`           | mint        | Full human translation.                                         |
| `en_only`         | muted grey  | English fallback — no translation exists yet.                   |

## Freshness and the "may lag" marker

`scripts/translation_audit.py` (www) writes these into each translated page's
`[extra]`; re-run it after every translation pass:

| Field | Meaning |
|---|---|
| `translation_updated` | Date of the translation's last real change (git; bookkeeping-only commits such as version bumps don't count). |
| `source_updated` | Date of the English page's last real change. |
| `translation_stale` | `true` when the English changed after the translation. |
| `translation_sync` | Structural parity with the English, 0–100: shortcodes (keyed by target — slug, book/chapter/verse, id, src) and headings shared by both, out of all that either has. Missing links and leftover sections from an older English both lower it. Measures structure, not prose. |

The pill gets the `--lagging` modifier (dashed border, amber ring on the dot,
a "may lag" suffix) when `translation_stale` is true **or** `translation_sync`
is below 95. Both dates appear in the tooltip and the accessible label; the
percentage is exposed only as `data-translation-sync`.

## Render condition

The macro emits no markup when either:

- `lang == "en"` (English pages don't need a translation-status pill), or
- `status` is empty / unknown.

## Related

- [Chrome → Translation indicators](../../chrome/translation-indicators/) — the visual surface and the related `translation-notice` banner.
- [Contributing → Translations](../../../contributing/content/translations/) — the editorial side.
