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

Religious/philosophical groupings. Each tradition's `name` and
`description` are multilingual (see `catalog.json.traditions[].name`
for the full keyed object):

```json
{
  "id": "raelian",
  "code": "RAE",
  "order": 1,
  "icon": "message-circle",
  "name": {
    "en": "Raëlian Corpus",
    "fr": "Corpus Raëlien",
    "de": "Raëlianisches Korpus"
  },
  "description": {
    "en": "The foundational texts of the Raëlian Movement..."
  }
}
```

The catalogue currently defines 20 traditions: `raelian`,
`hebrew-bible`, `christian`, `judaic`, `apocrypha`, `islamic`,
`mesopotamian`, `mormon`, `western_esoteric`, `egyptian`, `vedic`,
`levantine`, `kabbalah`, `ancient-astronaut`, `bahai`, `caodai`,
`oomoto`, `anatolian`, `persian`, `greek`. The full list with
descriptions is at the
[Library Acquisition Program](@/contributing/content/library-acquisition.md#the-20-traditions).
Adding a new tradition is a strategic decision documented in that
program; adding a new collection under an existing tradition is a
local catalog edit.

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

### Planned-book scaffolding

A book is **registered before any source acquisition** when it's
part of the
[Library Acquisition Program](@/contributing/content/library-acquisition.md)
queue. The catalog entry carries all the strategic metadata up
front so the queue is reviewable as a strategic catalogue, not
just a TODO list:

```json
{
  "slug": "vendidad-woh",
  "code": "VID-WOH",
  "tradition": "persian",
  "collection": "woh-translations",
  "order": 1,
  "priority": 5,
  "author": "Wheel of Heaven Translation Program",
  "publicationYear": 2026,
  "originalTitle": "Vidēvdād (Vendidad)",
  "originalLang": "ave",
  "primaryLang": "ave",
  "versionSource": "Geldner, Avesta: the Sacred Books of the Parsis, vol. 3 (1886-96, PD); avesta.org as collation aid; Darmesteter SBE 4 (1880, PD) as reference",
  "translationNote": "Planned Wheel of Heaven Translation from the Avestan. Initial scope: Fargard 2 — Ahura Mazda warns Yima of catastrophic winters and commands the vara, an enclosed refuge stocked with the seed of every species; the strongest engineered-survival narrative outside the flood cluster.",
  "availableLangs": [],
  "completeLangs": [],
  "chapters": 0,
  "paragraphs": 0,
  "tags": ["vendidad", "yima", "vara", "avestan", "zoroastrian", "wheel-of-heaven-translation"],
  "topics": ["catastrophe-refuge", "yima", "seed-preservation"],
  "status": "planned",
  "hasAudio": false,
  "hasVideo": false,
  "versionTitle": "Wheel of Heaven Translation",
  "shortVersionTitle": "WoH, 2026",
  "versionLicense": "CC0-1.0",
  "wohCurated": true,
  "translationProgram": true
}
```

`priority` orders the queue coarsely (5 = pilot wave, 6 =
build-out, 7 = long tail). `versionSource` must name the specific
open-licensed source edition the translation will be built from —
a planned book without a verified source edition does not enter
the catalogue. `translationProgram: true` marks Translation-track
books for downstream tooling; Edition-track books omit it.

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
