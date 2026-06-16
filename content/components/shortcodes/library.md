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

## Syntax — interlinear mode

Set `interlinear=true` (with `book` + `chapter` + `verse`, plus optional
`verse_end` for a range) to render the original-language line and its
transliteration beneath each translated line, pulled live from the chapter
data. The translation text comes from the data too, so the body is ignored
in this mode — keep it as a fallback for when the data can't be resolved.

{%/* raw */%}
```markdown
{%/* library(book="gilgamesh-woh", chapter=11, verse=14, verse_end=19, interlinear=true) */%}
(fallback English — ignored when the data resolves)
{%/* end */%}
```
{%/* endraw */%}

Each verse renders as the translation followed by a word-paired original
line: cuneiform-over-transliteration for Sumerian/Akkadian, script-over-
transliteration for Hebrew and Greek, or a single line where the corpus has
no per-word transliteration (e.g. Hebrew verses, which carry no romanization).
Direction and `lang` follow the verse's own `text_lang` when present, so a
Greek verse inside an Aramaic-catalogued book still renders left-to-right.
Partial-confidence cuneiform gets a ◑ badge.

Only books whose chapter data carries original-language fields produce an
interlinear; a modern translation with no original line falls back to the
plain translated quote.

## Parameters

| Param         | Type    | Required          | Default   | What                                                  |
|---------------|---------|-------------------|-----------|-------------------------------------------------------|
| `book`        | string  | yes (auto-mode)   | `""`      | Library book slug.                                     |
| `chapter`     | number  | no                | —         | Chapter number; appended as `#c<chapter>p<verse>` or `#chapter-<n>`. |
| `verse`       | number  | no                | —         | Verse number; combined with chapter for deep-link.    |
| `verse_end`   | number  | no                | `verse`   | End of a verse range (interlinear mode).              |
| `interlinear` | bool    | no                | `false`   | Render original + transliteration beneath each line, from chapter data. |
| `path`        | string  | yes (manual-mode) | `""`      | Override path (wins over auto-resolved).              |
| `title`       | string  | no                | `""`      | Override book title for the CTA label.                |

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

In interlinear mode the `__content` instead holds one `library-quote__il-verse`
per verse, each with a `library-quote__il-en` translation line and a
`library-quote__il-original` block of `library-quote__il-word` columns
(`__il-script` over `__il-translit`).

## Related

- [`glass-cloud-button`](../../visual-language/glass-cloud-button/) — the recipe behind the "Read in *Book*" CTA.
- [Content → wiki-shortcodes](../../content/wiki-shortcodes/) — the visual surface around library-quote blocks.
- [Macros → library](../../macros/library/) — the metadata accessors this shortcode uses to look up titles.
