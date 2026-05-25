+++
title = "info"
description = "Generic info / note / warning callout box. Paired-tag with optional title and icon."
template = "page.html"
weight = 50
+++

The `info` shortcode renders a bordered, accent-striped callout
box for asides, notes, or warnings. Paired-tag; the body is the
callout content.

**Source:**
[`themes/bifrost/templates/shortcodes/info.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/info.html)
&middot; visual surface:
[`.wiki-info-box`](../../content/wiki-shortcodes/)

## Syntax

```markdown
{%/* info(title="Note", type="info") */%}
This claim is hedged — the source uses *might* and *appears to*, not
literal assertion.
{%/* end */%}
```

| Param    | Type    | Required | Default  | What                                                       |
|----------|---------|----------|----------|------------------------------------------------------------|
| `type`   | string  | no       | `info`   | Variant: `info` / `note` / `warning` / `caution` / `tip`. |
| `title`  | string  | no       | `""`     | Optional header text.                                      |
| `icon`   | string  | no       | `""`     | Optional inline SVG to render before the title.            |

The body renders through Tera's `markdown` filter so multi-paragraph
callouts work.

## Related

- [Content → wiki-shortcodes](../../content/wiki-shortcodes/) — `.wiki-info-box` styling.
- [`definition`](../definition/) — the term-and-meaning variant.
