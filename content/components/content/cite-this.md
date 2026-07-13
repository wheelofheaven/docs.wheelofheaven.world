+++
title = "Cite this page"
description = "The citation widget (APA / MLA / Chicago / BibTeX + permalink) rendered near the end of reference pages."
template = "page.html"
weight = 45
+++

`.cite` is a self-contained **"Cite this page"** widget — a `<details>` block
that offers four ready-to-copy citation formats plus a permalink. It derives
everything from page metadata, so there's **no per-page editorial cost**
(Decision 15, H1.3 — the citation ecosystem).

**Source:** the page partial
[`partials/cite-this.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/cite-this.html)
and the book partial
[`partials/cite-book.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/cite-book.html)
compute citation fields and defer rendering to the shared macro
[`macros/cite.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/cite.html).
Copy-to-clipboard is [`static/js/cite-copy.js`](https://github.com/wheelofheaven/bifrost/blob/main/static/js/cite-copy.js)
(core bundle); styling is
[`sass/components/_cite.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_cite.scss).
The "Cite this page/text" label is localized via the `citeThisPage` /
`citeThisText` translation keys.

## Formats

| Format | Shape |
|---|---|
| APA | `Title. (Year). Wheel of Heaven. URL` |
| MLA | `"Title." Wheel of Heaven, Year, URL.` |
| Chicago | `"Title." Wheel of Heaven, Year. URL.` |
| BibTeX | `@misc{woh-<slug>, …, author = {{Wheel of Heaven}}, note = {CC0-1.0 public domain}}` |

- **Author** — `page.extra.author`, falling back to `config.extra.author`
  ("Wheel of Heaven"). BibTeX wraps it in double braces so a corporate name
  isn't split into first/last.
- **Year** — falls back `page.date` → `page.updated` → `page.extra.editorial_pass`
  (first four chars) → `n.d.`
- **URL** — `page.permalink` (language-correct on translated pages).

## Anatomy

| Class | What |
|---|---|
| `.cite` | The `<details>` container. |
| `.cite__summary` | The clickable "Cite this page" disclosure. |
| `.cite__format` | One format block (label + copy button + text). |
| `.cite__format-label` | `APA` / `MLA` / `Chicago` / `BibTeX`. |
| `.cite__copy` | Per-format copy-to-clipboard button (small inline script). |
| `.cite__text` | The `<pre>` citation — selectable and copyable. |

## Where it's wired

`partials/cite-this.html` (the page widget) is included near the end of the
article on **wiki**, **article**, and **timeline** pages, just before the "Read
next" block.

**Library** books get a book-aware sibling,
[`partials/cite-book.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/cite-book.html),
in the book sidebar beside Licensing. It cites the *reproduced work* — author,
title, and publication year from the catalog (`current_book_entry`) — via the
Wheel of Heaven digital edition (`@book`, author-first; title-first when no
author). Both share the `.cite` component.

## Live examples

Bottom of any wiki entry, e.g.
[/wiki/elohim/](https://www.wheelofheaven.world/wiki/elohim/).

## Related

- [Content → Related content](../related-content/) — the "Read next" block that
  sits just below.
- [Reference → Datasets](../../../reference/datasets/) — the dataset landing
  pages carry a parallel "cite this dataset" block.
