+++
title = "wiki"
description = "Canon-internal link to a wiki entry. Paired-tag, body is the visible label."
template = "page.html"
weight = 10
+++

The `wiki` shortcode is the canonical way to link to a wiki entry
from inside markdown. The shortcode is paired (takes a body, which is
the visible label) and language-aware (resolves the right `/wiki/<slug>/`
path for the page's current language).

**Source:**
[`themes/bifrost/templates/shortcodes/wiki.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/wiki.html)

## Syntax

{%/* raw */%}
```markdown
The {%/* wiki(slug="elohim") */%}Elohim{%/* end */%} created humanity in
laboratories described in {%/* wiki(slug="genesis") */%}Genesis{%/* end */%}.
```
{%/* endraw */%}

| Param   | Type   | Required | Default | What                                     |
|---------|--------|----------|---------|------------------------------------------|
| `slug`  | string | yes      | —       | Wiki entry slug (the path segment after `/wiki/`). |

The body is rendered with `markdown(inline=true)` so light inline
markup (`*emphasis*`, `**bold**`) inside the label still works.

## Output

```html
<a class="wikilink" href="/wiki/elohim/">Elohim</a>
```

`.wikilink` is the dotted-underline style that signals "canon-internal
link" — visually distinct from outbound links. The
[glossary tooltip](../../interactive/glossary-tooltip/) attaches to
these on hover.

## Why use this instead of a markdown link

| ✗ Bad                         | ✓ Good                                            |
|-------------------------------|---------------------------------------------------|
| `[Elohim](/wiki/elohim/)`     | the `wiki` shortcode with `slug="elohim"` and body `Elohim` |

The shortcode form centralises the path. If `/wiki/` ever moves or gets
renamed, every reference still resolves. And the rendered link gets the
right `.wikilink` class for free.

## Related

- [Content → wiki-shortcodes](../../content/wiki-shortcodes/) — the visual surface (`.wikilink`).
- [Interactive → glossary tooltip](../../interactive/glossary-tooltip/) — the hover preview attached to `.wikilink` elements.
