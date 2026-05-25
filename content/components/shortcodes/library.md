+++
title = "library"
description = "Library-quote block. Paired-tag, body is the quoted text. Auto-resolves book metadata + deep-link from `book`/`chapter`/`verse` args."
template = "page.html"
weight = 20
+++

The `library` shortcode renders a structured library-quote block:
the quoted text in a blockquote, a "Read in *Book*" CTA built on
[`glass-cloud-button`](../../visual-language/glass-cloud-button/), and a
citation row. Use it to quote a Library book inside markdown.

**Source:**
[`themes/bifrost/templates/shortcodes/library.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/library.html)

## Syntax — auto-resolve mode

When `book` is set (and optionally `chapter` + `verse`), the shortcode
auto-resolves the deep-link path and looks up the book's English title
from `data/library/<book>/_meta.json`:

{%/* raw */%}
```markdown
{%/* library(book="genesis-woh", chapter=1, verse=1) */%}
When the Elohim began to shape the skies and the land—
{%/* end */%}
```
{%/* endraw */%}

## Syntax — manual mode

For legacy callers or one-off cases, pass `path` and `title` directly:

{%/* raw */%}
```markdown
{%/* library(path="/library/some-book/", title="Some Book") */%}
Quoted text here.
{%/* end */%}
```
{%/* endraw */%}

Manual `path` always wins over the resolved one.

## Parameters

| Param      | Type    | Required          | Default | What                                                  |
|------------|---------|-------------------|---------|-------------------------------------------------------|
| `book`     | string  | yes (auto-mode)   | `""`    | Library book slug.                                     |
| `chapter`  | number  | no                | —       | Chapter number; appended as `#c<chapter>p<verse>` or `#chapter-<n>`. |
| `verse`    | number  | no                | —       | Verse number; combined with chapter for deep-link.    |
| `path`     | string  | yes (manual-mode) | `""`    | Override path (wins over auto-resolved).              |
| `title`    | string  | no                | `""`    | Override book title for the CTA label.                |

## Output structure

```html
<blockquote class="library-quote">
    <div class="library-quote__content">…body…</div>
    <div class="library-quote__link">
        <a class="library-quote__button" …>
            <svg …></svg>
            <span class="library-quote__button-text">Read in {title}</span>
            <svg …></svg>
        </a>
    </div>
    <cite class="library-quote__citation">{title} {chapter}:{verse}</cite>
</blockquote>
```

`.library-quote__button` is styled by [`glass-cloud-button`](../../visual-language/glass-cloud-button/)
with a mauve→cyan cloud-duo.

## Related

- [`glass-cloud-button`](../../visual-language/glass-cloud-button/) — the recipe behind the "Read in *Book*" CTA.
- [Content → wiki-shortcodes](../../content/wiki-shortcodes/) — the visual surface around library-quote blocks.
- [Macros → library](../../macros/library/) — the metadata accessors this shortcode uses to look up titles.
