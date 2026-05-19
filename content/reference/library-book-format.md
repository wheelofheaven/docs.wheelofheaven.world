+++
title = "Library Book Format"
description = "JSON schema for books in data-library — split-chapter layout, paragraph refIds, and i18n slots."
weight = 20
+++

The library uses a split-chapter JSON format for paragraph-level content
and deep linking.

## Directory structure

```
data-library/
├── catalog.json
└── the-book-which-tells-the-truth/
    ├── _meta.json           # book metadata
    ├── chapter-1.json       # chapter content
    ├── chapter-2.json
    ├── chapter-3.json
    ├── chapter-4.json
    ├── chapter-5.json
    ├── chapter-6.json
    └── chapter-7.json
```

## Book metadata (`_meta.json`)

```json
{
  "slug": "the-book-which-tells-the-truth",
  "code": "TBWTT",
  "refId": "TBWTT",
  "titles": {
    "fr": "Le Livre Qui Dit la Vérité",
    "en": "The Book Which Tells the Truth",
    "de": "Das Buch, das die Wahrheit verkündet"
  },
  "publicationYear": 1973,
  "primaryLang": "fr",
  "schema": ["book", "chapters", "paragraphs"],
  "revision": 1,
  "updated": "2026-01-24T08:57:31Z",
  "chapterCount": 7,
  "paragraphCount": 1029,
  "chapterFiles": [
    { "n": 1, "file": "chapter-1.json", "title": "La Rencontre", "paragraphs": 62 },
    { "n": 2, "file": "chapter-2.json", "title": "La Vérité", "paragraphs": 113 }
  ]
}
```

## Chapter format (`chapter-N.json`)

```json
{
  "n": 1,
  "bookSlug": "the-book-which-tells-the-truth",
  "bookCode": "TBWTT",
  "refId": "TBWTT-1",
  "title": "La Rencontre",
  "i18n": {
    "en": "The Encounter",
    "de": "Die Begegnung"
  },
  "paragraphs": [
    {
      "n": 1,
      "speaker": "Narrator",
      "text": "Depuis l'âge de neuf ans...",
      "i18n": {
        "en": "Since the age of nine...",
        "de": ""
      },
      "refId": "TBWTT-1:1"
    },
    {
      "n": 2,
      "speaker": "Narrator",
      "text": "Si j'allais, ce matin...",
      "i18n": {
        "en": "On the morning of...",
        "de": ""
      },
      "refId": "TBWTT-1:2"
    }
  ]
}
```

## Reference ID format

```
{BOOK_CODE}-{chapter}:{paragraph}
```

Examples:

- `TBWTT-1:5` — Book TBWTT, chapter 1, paragraph 5
- `TBWTT-3:100` — chapter 3, paragraph 100

## Paragraph schema

| Field | Type | Description |
|-------|------|-------------|
| `n` | number | Paragraph number (1-indexed) |
| `speaker` | string | Who is speaking (Narrator, Yahweh, etc.) |
| `text` | string | Original-language text |
| `i18n` | object | Translations keyed by language code |
| `refId` | string | Canonical reference ID |

## Speaker types

- `Narrator` — narrative text
- `Yahweh` — Yahweh speaking
- `Elohim` — Elohim (collective)
- `Claude` — Claude Vorilhon
- `Dialogue` — conversation marker

## URL deep-linking

The reader supports both refId and short-format anchors:

```
/library/the-book-which-tells-the-truth/#TBWTT-1:5    (refId)
/library/the-book-which-tells-the-truth/#c1p5         (short form)
```

## Translation status

Empty string `""` indicates a translation is not yet complete:

```json
"i18n": {
  "en": "Translated text here",
  "de": "",
  "es": ""
}
```

## Adding new content

### 1. Create metadata

Create `_meta.json` with book info and the chapter index.

### 2. Create chapters

Create `chapter-N.json` for each chapter with a paragraph array.

### 3. Update catalog

Add the book entry to `catalog.json`. See
[Library Book](@/contributing/content/library-book.md) for the catalog
schema.

### 4. Validate

```sh
python -m json.tool book-name/_meta.json
python -m json.tool book-name/chapter-1.json
```

### 5. Deploy

Update submodule pointers in `www` and `api`, then push.
