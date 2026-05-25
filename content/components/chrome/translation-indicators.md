+++
title = "Translation indicators"
description = "Two components that signal translation status on non-English pages: the inline translation-badge and the page-top translation-notice banner."
template = "page.html"
weight = 50
+++

Two related Bifrost components surface translation status on non-English
pages. They're documented together because they share the same data
source (`page.extra.translation_status`) and the same status taxonomy.

## `.translation-badge`

Small inline pill rendered next to article titles on non-English pages.

**Source:**
[`themes/bifrost/sass/components/_translation-badge.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_translation-badge.scss)
&middot;
[`templates/macros/translation-badge.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/translation-badge.html)

| Status            | Accent      | Reading                                        |
|-------------------|-------------|------------------------------------------------|
| `metadata-only`   | `$yellow`   | Title + description translated; body is English. |
| `machine`         | `$mauve`    | Body auto-translated, awaiting human pass.     |
| `human`           | `$mint`     | Full human translation.                        |
| `en-only`         | muted       | English fallback — no translation exists yet.  |

```tera
{%/* import "macros/translation-badge.html" as t */%}
{{ t::render(status=page.extra.translation_status) }}
```

## `.translation-notice`

Glassmorphic pill that docks under the navbar at the top of non-English
pages. Designed as a visual companion to the navbar — same pill geometry
and glass treatment.

**Source:**
[`themes/bifrost/sass/components/_translation-notice.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_translation-notice.scss)
&middot;
[`templates/partials/translation-notice.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/translation-notice.html)

Critically, the notice is `position: absolute` (not `fixed`), so it
scrolls with the document — slides up behind the fixed navbar as the
reader scrolls down and re-appears when they return to the top. The
navbar's `:has()` override keeps it fixed regardless.

## Live examples

- **Translation badge** — any non-English wiki entry, e.g.
  [www.wheelofheaven.world/de/wiki/elohim/](https://www.wheelofheaven.world/de/wiki/elohim/)
- **Translation notice** — top of any non-English page, scrolls with the document.

## Related

- [Macros → `translation-badge`](../../macros/translation-badge/) — the macro that renders the badge.
- [Contributing → Translations](../../../contributing/content/translations/) — the editorial side of translation status.
