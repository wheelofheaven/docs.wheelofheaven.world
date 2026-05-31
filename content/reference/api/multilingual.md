+++
title = "Multilingual Routing"
description = "How language is expressed in the API — path-prefix mirror."
weight = 50
+++

The API mirrors the www site's multilingual convention:

- **English** is the default. URLs have no language prefix: `/v1/wiki/elohim/`.
- **Other languages** prefix the language code: `/v1/de/wiki/elohim/`,
  `/v1/ja/wiki/elohim/`, `/v1/zh-Hant/wiki/elohim/`.

Each `/v1/{lang}/...` is a separate set of pre-built files; the
language tree is wholly parallel to the English tree.

## Supported languages

| Code | Native name | English name |
|---|---|---|
| `en` | English | English (default) |
| `de` | Deutsch | German |
| `fr` | Français | French |
| `es` | Español | Spanish |
| `ru` | Русский | Russian |
| `ja` | 日本語 | Japanese |
| `zh` | 简体中文 | Simplified Chinese |
| `zh-Hant` | 繁體中文 | Traditional Chinese |
| `ko` | 한국어 | Korean |
| `he` | עברית | Hebrew (reserved; empty until translations land) |

The canonical list is at `/v1/enums/languages/`.

## What's mirrored

| Section | English-only fallback? |
|---|---|
| `/v1/wiki/` | No — all 9 active languages have full or partial coverage. |
| `/v1/timeline/` | No — 6 of 8 active languages have full coverage; `ko` and `zh-Hant` have only framing pages currently. |
| `/v1/articles/` | Yes — articles currently only ship in English. |
| `/v1/news/` | Yes — Newsroom dispatches currently only ship in English. |
| `/v1/sources/traditions/` | English only for now. |
| `/v1/library/` | Full URL mirror under `/v1/{lang}/library/...` for all 9 languages. Catalog titles/names, chapter titles, and per-paragraph text are returned in the requested language with English fallback; book/meta responses set `metadata.fallback=true` when the requested language isn't in `completeLangs`. Per-paragraph i18n maps are included in every chapter response. |

## What's *not* mirrored

These endpoints are language-agnostic and live only at their root
paths:

- `/v1/schema/*` (schemas are English-described JSON Schemas)
- `/v1/enums/*` (enum *values* are language-agnostic identifiers;
  enum *labels* in the response are English)
- `/v1/sources/{id}/` (bibliography records are stored once; their
  internal `description.{lang}` map is multilingual)
- `/v1/glossary/{term_id}/` (already multilingual in a single response)
- `/v1/translations/{slug}/` (multilingual in a single response)
- `/v1/context/*` (English curated narrative; translations may follow)

## Translation status

Every content response includes a `translation_status` field per
Decision 12:

| Value | Meaning |
|---|---|
| `en_only` | Source language only; no translations published yet. |
| `partial` | Some languages translated. |
| `complete` | All supported languages translated. |

## When a translation doesn't exist

Requesting a language-prefixed URL for a page that isn't translated
returns the standard 404 page (HTML) at the moment. The planned
`NotTranslated` JSON envelope (see
[Envelope](@/reference/api/envelope.md)) will follow once Cloudflare
404 routing is configured.

## URL hints in responses

Every content response's `links.canonical_html` points at the
corresponding www HTML URL in the same language:

```json
"links": {
  "self": "/v1/de/wiki/elohim/",
  "canonical_html": "https://www.wheelofheaven.world/de/wiki/elohim/"
}
```

## Why path-prefix instead of `?lang=`

Path-prefix mirrors www, gives every language its own cacheable file
on the CDN edge, and makes the URL self-describing. A query parameter
would have shared cache keys with English and obscured which language
a URL was for.
