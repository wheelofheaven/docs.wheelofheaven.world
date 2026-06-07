+++
title = "cite"
description = "Inline citation marker — superscript pill that anchors to the matching `#ref-<id>` entry in the references list."
template = "page.html"
weight = 30
+++

The `cite` shortcode renders an inline citation marker — a small
superscript pill that links to the matching entry in the page's
references list.
On wiki pages, the `id` is usually a stable source ID from
`data/sources.json`, so the marker and the reference entry stay aligned
even when the list order changes.

**Source:**
[`themes/bifrost/templates/shortcodes/cite.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/cite.html)

## Syntax

```markdown
The Elohim created humanity in laboratories described in
Genesis{{/* cite(id="sefaria", text="[1]", title="Genesis 2:7") */}}.
```

| Param   | Type    | Required | Default       | What                                                  |
|---------|---------|----------|---------------|-------------------------------------------------------|
| `id`    | string  | yes      | —             | Anchors to `#ref-<id>` — must match a reference entry, usually a stable source ID. |
| `text`  | string  | no       | `[<id>]`      | The visible marker label.                              |
| `title` | string  | no       | `"Reference"` | Tooltip text on hover.                                 |

## Output

```html
<sup class="wiki-cite">
    <a href="#ref-sefaria" class="wiki-cite__link" title="Genesis 2:7">[1]</a>
</sup>
```

Styled by [`.wiki-cite`](../../content/wiki-shortcodes/) — superscript
pill in `font-family-tech`, accent-coloured background on hover.

## Related

- [Content → wiki-shortcodes](../../content/wiki-shortcodes/) — `.wiki-cite` styling.
- [`ref`](../ref/) — numbered-only variant.
- [`reference`](../reference/) — supports both key-based and number-based ids.
