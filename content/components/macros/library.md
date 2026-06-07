+++
title = "library"
description = "Per-book metadata lookup macros — language-aware title, subtitle, description accessors that fall back through (lang → en → primaryLang)."
template = "page.html"
weight = 50
+++

`macros/library.html` exposes accessor macros that read a Library book's
metadata dictionary and return the right localized string for the current
language. The macros encode a consistent fallback chain so callers never
need to write it manually.

**Source:**
[`themes/bifrost/templates/macros/library.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/library.html)

## Public API

```tera
{%/* import "macros/library.html" as library */%}

{%/* set book = load_data(path="library/the-book-which-tells-the-truth/_meta.json") */%}

{{ library::get_book_title(book_data=book, lang=detected_lang) }}
{{ library::get_book_subtitle(book_data=book, lang=detected_lang) }}
{{ library::get_book_description(book_data=book, lang=detected_lang) }}
{{ library::get_book_version_title(book_data=book, lang=detected_lang) }}
{{ library::get_book_short_version_title(book_data=book, lang=detected_lang) }}
{{ library::lang_name(code=book.originalLang) }}
```

## Fallback chain

Every accessor walks the same chain so missing translations degrade
gracefully:

1. `book_data.<field>[<lang>]` — the requested language.
2. `book_data.<field>.en` — English fallback.
3. `book_data.<field>[book_data.primaryLang]` — the book's primary
   language (only for `get_book_title`).
4. Empty string — for missing translations.

## Version labels

`get_book_version_title` and `get_book_short_version_title` read the
Sefaria-style `versionTitles` and `shortVersionTitles` fields from
`_meta.json`. These are edition labels, not work titles: for example,
`Genesis` is the book title and `Wheel of Heaven Translation` is the
version title.

The library book template also reads the structured `version` object from
`_meta.json` and renders a compact provenance panel when present. That
panel uses `lang_name` for source-language and witness labels, and surfaces
license, source record, base text, method, witness stack, and responsibility
metadata without changing older book records.

## Why these are macros, not template helpers

Library book pages reuse these accessors in multiple positions
(title bar, breadcrumbs, related-books panel, OG meta tags). Centralising
the fallback logic in one macro means every position renders the same
string for the same book in the same language.

## Related

- [Shortcodes → library](../../shortcodes/library/) — the content-side shortcode that uses the same metadata source.
