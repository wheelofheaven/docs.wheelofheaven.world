+++
title = "definition"
description = "Glossary-style definition box. Paired-tag, body is the definition."
template = "page.html"
weight = 40
+++

The `definition` shortcode renders a bordered, accent-striped box
that calls out a definition inside an article body. Paired-tag; the
body is the definition text.

**Source:**
[`themes/bifrost/templates/shortcodes/definition.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/definition.html)
&middot; visual surface:
[`.wiki-definition-box`](../../content/wiki-shortcodes/)

## Syntax

```markdown
{%/* definition(term="Elohim", type="standard") */%}
Hebrew plural noun, "those who came from the sky." In the Wheel of
Heaven framing, the Elohim are an extraterrestrial civilisation.
{%/* end */%}
```

| Param    | Type    | Required | Default    | What                                                  |
|----------|---------|----------|------------|-------------------------------------------------------|
| `term`   | string  | yes      | —          | The term being defined; rendered in the header.       |
| `type`   | string  | no       | `standard` | Variant modifier: `standard` / `compact` / `etymology`. |

The body renders through Tera's `markdown` filter so paragraphs and
inline formatting work as expected.

## Related

- [Content → wiki-shortcodes](../../content/wiki-shortcodes/) — `.wiki-definition-box` styling.
- [`info`](../info/) — the non-definitional companion box.
