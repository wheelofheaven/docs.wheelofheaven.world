+++
title = "Library Book"
description = "Adding a book to the Library — catalog entry, split-chapter JSON, paragraph refIds, and the reader."
weight = 40
+++

The library system provides a book reader with study tools (bookmarks,
highlights, progress tracking, paragraph-level deep linking). Books live
in the [`data-library`](https://github.com/wheelofheaven/data-library)
submodule as structured JSON.

## Overview

- **Repository:** `data-library`
- **Format:** JSON (split-chapter per book)
- **Reference IDs:** `{CODE}-{chapter}:{paragraph}` (e.g. `TBWTT-1:5`)

For the full JSON schema, see the
[Library Book Format reference](@/reference/library-book-format.md). This
page covers the *authoring* side — what to do when you want to add a book.

## Catalog structure

```json
// catalog.json
{
  "version": "1.0",
  "updated": "2026-01-24",
  "traditions": [...],
  "collections": [...],
  "books": [...]
}
```

### Traditions

Religious/philosophical groupings:

```json
{
  "id": "raelian",
  "name": "Raëlian",
  "description": "Scriptures of the Raëlian Movement",
  "color": "#f9c74f"
}
```

Available: `raelian`, `biblical`, `apocrypha`, `ancient-astronaut`.

### Collections

Book series or groupings:

```json
{
  "id": "raelian-canon",
  "name": "Raëlian Canon",
  "tradition": "raelian",
  "books": [
    "the-book-which-tells-the-truth",
    "extraterrestrials-took-me-to-their-planet"
  ]
}
```

### Books

Individual book entries:

```json
{
  "slug": "the-book-which-tells-the-truth",
  "code": "TBWTT",
  "title": "The Book Which Tells the Truth",
  "author": "Claude Vorilhon (Raël)",
  "tradition": "raelian",
  "collection": "raelian-canon",
  "publicationYear": 1973,
  "originalTitle": "Le Livre Qui Dit la Vérité",
  "primaryLang": "fr",
  "availableLangs": ["fr", "en", "de", "es", "ru", "ja", "zh"],
  "completeLangs": ["fr", "en"],
  "chapters": 7,
  "paragraphs": 1029,
  "status": "complete",
  "format": "split"
}
```

## Book status

| Status | Meaning |
|--------|---------|
| `complete` | All chapters shipped and signed off |
| `partial` | At least one chapter shipped, more to come |
| `planned` | Wrapper scaffolded; no chapters shipped yet |

The lifecycle is `planned → partial → complete`. The bifrost
`/library/` index renders `complete` and `partial` books in the main
grid and groups `planned` ones in a separate "planned" list. A book
with status `planned` is therefore invisible to the available-books
filter even if chapters exist on disk — see
[Catalog validation](#catalog-validation) below.

## Catalog validation

```bash
mise run cat validate         # report-only
mise run cat validate --fix   # auto-correct
```

The validator walks `catalog.json` against the per-book data on disk
and reports drift in `chapters`, `paragraphs`, `availableLangs`, and
`status`. With `--fix` it rewrites `catalog.json` in place.

The most important rule it enforces: **`planned → partial` is
auto-promoted as soon as a chapter ships.** `status` is set manually
when a wrapper is scaffolded, and there is no other automatic step
that flips it once `data-library/{slug}/_meta.json` starts listing
chapters. Without this promotion the book stays catalog-flagged as
planned and is hidden from the main library grid (the 2026-05-22
"Job and Ezekiel went missing" incident). The `partial → complete`
transition is *not* automated — that's an editorial sign-off, not a
file-count check, and must be flipped by hand.

Run `validate --fix` before bumping the `data-library` submodule
pointer in `www` and `api` — that's the moment where catalog drift
would otherwise ship to production.

## Reference IDs

Each book has a code used for inline references across the site:

| Book | Code | Example |
|------|------|---------|
| The Book Which Tells the Truth | TBWTT | `TBWTT-1:5` |
| Extraterrestrials Took Me… | ETMTP | `ETMTP-2:10` |

Format: `{CODE}-{chapter}:{paragraph}`.

## API access

```
GET https://api.wheelofheaven.world/v1/traditions/
```

Returns the catalog as JSON.

## Template usage

In Zola templates:

```tera
{% set catalog = load_data(path="data/library/catalog.json") %}

{% for book in catalog.books %}
  <div class="book">{{ book.title }}</div>
{% endfor %}
```

## Adding a new book

1. **Catalog entry** — add the book object to `catalog.json`.
2. **Book directory** — create `data-library/{slug}/` with `_meta.json`
   and `chapter-N.json` files. See the
   [Library Book Format reference](@/reference/library-book-format.md)
   for the exact schema.
3. **Submodule pointers** — bump `data-library` in both `www` and `api`.
4. **Build + deploy** — push to trigger the Cloudflare Pages rebuild.
