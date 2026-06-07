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

## Version provenance metadata

Books may include a structured `version` object in `_meta.json`. This
describes the edition or translation being displayed, separately from the
work title. The public API exposes this object, and the website renders a
sidebar provenance panel when it is present.

```json
{
  "versionTitles": {
    "en": "Wheel of Heaven Translation"
  },
  "shortVersionTitles": {
    "en": "WoH, 2026"
  },
  "version": {
    "schemaVersion": 1,
    "title": "Wheel of Heaven Translation",
    "shortTitle": "WoH, 2026",
    "type": "curated-translation",
    "language": "en",
    "sourceLanguage": "arc",
    "refSystem": "chapter-verse",
    "scope": "1 Enoch 1-36 and 72-82",
    "license": {
      "status": "project-cc0",
      "spdx": "CC0-1.0",
      "url": "https://creativecommons.org/publicdomain/zero/1.0/"
    },
    "provenance": {
      "sourceRecordId": "book-of-enoch",
      "baseText": "Layered Aramaic, Greek, and Ge'ez witness reconstruction",
      "method": "Best-effort reconstruction with per-verse layered witness attribution.",
      "citation": "See sourceCitation for bibliography.",
      "witnesses": [
        {
          "role": "primary",
          "language": "arc",
          "label": "Aramaic Dead Sea Scrolls fragments"
        },
        {
          "role": "secondary",
          "language": "grc",
          "label": "Greek Akhmim Panopolitanus witness where extant"
        }
      ]
    },
    "responsibility": {
      "translator": "Wheel of Heaven",
      "reviewer": "zarazinsfuss"
    }
  },
  "sourceCitation": "Milik, J. T., The Books of Enoch..."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `version.schemaVersion` | number | Version-provenance schema revision. Current value is `1`. |
| `version.title` | string | Human-readable edition or translation title. |
| `version.shortTitle` | string | Compact label for chips and dense UI. |
| `version.type` | string | Edition class, such as `translation` or `curated-translation`. |
| `version.language` | string | BCP-47 language code for the rendered version. |
| `version.sourceLanguage` | string | BCP-47 language code for the source language or primary source witness. |
| `version.refSystem` | string | Reference system used by the record, such as `chapter-verse`. |
| `version.scope` | string | Coverage statement for partial or staged editions. |
| `version.license` | object | License metadata. Prefer SPDX identifiers when available. |
| `version.provenance.sourceRecordId` | string | Library slug for the source or base record when one exists. |
| `version.provenance.sourceUrl` | string | External source URL when there is no internal source record, or when the record needs an upstream issue/source link. |
| `version.provenance.baseText` | string | Source text, critical edition, or witness stack used as the base. |
| `version.provenance.method` | string | Concise statement of how the version was produced. |
| `version.provenance.citation` | string | Short citation note. Long bibliography belongs in top-level `sourceCitation`. |
| `version.provenance.witnesses` | array | Ordered witness list for layered reconstructions. |
| `version.responsibility` | object | Translator, editor, reviewer, or other responsibility labels. |

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
