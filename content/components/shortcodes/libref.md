+++
title = "libref"
description = "Inline library-reference link. Paired-tag, body is the visible label. The inline counterpart to the `library` blockquote shortcode."
template = "page.html"
weight = 25
+++

The `libref` shortcode is the canonical way to link to a Library
deep-link from inside prose. It is the *inline* counterpart to the
[`library`](../library/) blockquote shortcode — use `libref` when you
want a small reference tucked into a sentence, use `library` when you
want to display the quoted text as a pulled blockquote with a
"Read in *Book*" CTA.

**Source:**
[`themes/bifrost/templates/shortcodes/libref.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/libref.html)

## Syntax

{%/* raw */%}
```markdown
The transition signal is preserved in {%/* libref(book="zephaniah", chapter=1, verse=10) */%}Zephaniah 1:10{%/* end */%}:

… preserved in {%/* libref(book="genesis-woh", chapter=1, verse=1) */%}Genesis 1:1{%/* end */%}.

… most importantly the {%/* libref(book="book-of-enoch") */%}Book of Enoch{%/* end */%}.
```
{%/* endraw */%}

## Parameters

| Param      | Type    | Required | Default | What                                                              |
|------------|---------|----------|---------|-------------------------------------------------------------------|
| `book`     | string  | yes      | —       | Library book slug (path segment after `/library/`).               |
| `chapter`  | number  | no       | —       | Chapter number. With `verse`, becomes `#c<chapter>p<verse>`; alone, becomes `#chapter-<chapter>`. |
| `verse`    | number  | no       | —       | Verse number. Combined with `chapter` for the deep-link anchor.   |

The body is rendered with `markdown(inline=true)` so light inline
markup (`*emphasis*`, `**bold**`) inside the label still works.

## Output

```html
<a class="libref" href="/library/zephaniah/#c1p10">Zephaniah 1:10</a>
```

`.libref` is style-light (no visual rules of its own) — the cascade in
content-area templates already applies the underline + accent colour.
The class exists so future code can target libref-only behaviour
(analytics, alternate visual modes) without re-grepping templates.

## Why use this instead of a markdown link

| ✗ Bad                                                       | ✓ Good                                                              |
|-------------------------------------------------------------|---------------------------------------------------------------------|
| `[Zephaniah 1:10](/library/zephaniah/#c1p10)`               | the `libref` shortcode with `book="zephaniah", chapter=1, verse=10` |

Two reasons:

1. **Language-awareness.** The shortcode resolves the path via
   `get_url(..., lang=lang)`, so the same source line renders
   `/library/zephaniah/#c1p10` in English and `/de/library/zephaniah/#c1p10`
   in German automatically. A raw markdown link hard-codes the English
   path forever.
2. **Path centralisation.** If `/library/` ever moves or gets renamed,
   every reference still resolves.

## When to use `libref` vs `library`

| Use case                                                              | Reach for     |
|-----------------------------------------------------------------------|---------------|
| Inline mention of a scripture reference in flowing prose              | `libref`      |
| Pulled-quote block displaying the verse text with a "Read in" button  | `library`     |

Both auto-resolve language-aware paths; they differ only in visual
weight.

## Related

- [`library`](../library/) — the blockquote sibling for displayed quotations.
- [`wiki`](../wiki/) — the same pattern for wiki entries (`/wiki/<slug>/`).
- [Content → wiki-shortcodes](../../content/wiki-shortcodes/) — the visual surface around inline canon-internal links.
