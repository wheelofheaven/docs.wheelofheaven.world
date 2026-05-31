+++
title = "Endpoints"
description = "Every URL exposed by api.wheelofheaven.world, organised by resource family."
weight = 10
+++

Every URL in `/v1/`. The base URL is `https://api.wheelofheaven.world`.

All endpoints respond `GET`, return `application/json`, and serve
identical content at the directory form (`/v1/wiki/elohim/`) and the
explicit-extension form (`/v1/wiki/elohim/index.json`). The directory
form is canonical.

## Discovery & meta

| Endpoint | Returns |
|---|---|
| `GET /` | Root manifest — links to `/v1/` and `/llms.txt`. |
| `GET /llms.txt` | LLM-oriented manifest for the API surface. |
| `GET /sitemap.xml` | Zola-generated sitemap of every JSON endpoint. |
| `GET /robots.txt` | Crawler permissions. |
| `GET /v1/` | v1 manifest with the full endpoint catalogue. |

## Encyclopedia content

| Endpoint | Kind | Returns |
|---|---|---|
| `GET /v1/wiki/` | `WikiIndex` | All wiki entries (slug, title, description, claim_type, category, editorial_pass). |
| `GET /v1/wiki/{slug}/` | `WikiEntry` | Single entry with `body_html` and full `extra` table (infobox, references, see_also). |
| `GET /v1/timeline/` | `TimelineIndex` | All 15 timeline entries — 12 ages + 3 framing pages. |
| `GET /v1/timeline/{slug}/` | `TimelineEntry` | Single age/framing page with start_year, end_year, symbol, body_html. |
| `GET /v1/articles/` | `ArticleIndex` | All articles. |
| `GET /v1/articles/{slug}/` | `Article` | Single article with body_html. |
| `GET /v1/news/` | `NewsIndex` | All Newsroom dispatches. |
| `GET /v1/news/{slug}/` | `Dispatch` | Single dispatch with event_date, event_type, sources, canon_links. |

## Library (texts)

| Endpoint | Kind | Returns |
|---|---|---|
| `GET /v1/library/` | `LibraryOverview` | Counts (totalBooks, totalTraditions). |
| `GET /v1/library/books/` | `BookList` | All ~100 books (slug, code, tradition, chapters, paragraphs, status). |
| `GET /v1/library/books/{slug}/` | `Book` | Book metadata + chapter index. |
| `GET /v1/library/books/{slug}/meta` | `BookMeta` | Lightweight metadata only. |
| `GET /v1/library/books/{slug}/chapters/` | `ChapterList` | Chapter index for a book. |
| `GET /v1/library/books/{slug}/chapters/{n}` | `Chapter` | Single chapter with paragraphs and refIds. |
| `GET /v1/library/traditions/` | `TraditionList` | The catalog's library-shelf traditions. |
| `GET /v1/library/traditions/{slug}/` | `Tradition` | Single tradition with its book list. |

The historical paths `/v1/catalog/`, `/v1/books/`, and `/v1/traditions/`
are **preserved as stable listing aliases**: hitting them returns the
same listing data with `links.canonical` pointing at the library-prefixed
URL. Per-item legacy paths (`/v1/books/{slug}/`, `/v1/traditions/{slug}/`)
issue a `301` to the canonical library-prefixed URL.

## Sources & hubs

| Endpoint | Kind | Returns |
|---|---|---|
| `GET /v1/sources/` | `SourceIndex` | All 58+ bibliography records (id, title, source_family, relation_to_wheel, stance). |
| `GET /v1/sources/{id}/` | `Source` | Full source record with authority_tier, family, stance, licensing, library_slug cross-link. |
| `GET /v1/sources/traditions/` | `TraditionHubIndex` | All tradition hubs. |
| `GET /v1/sources/traditions/{slug}/` | `TraditionHub` | Tradition hub body explaining why a tradition is included and where it converges / diverges from the canon. |
| `GET /v1/concepts/` | `ConceptHubIndex` | Concept hubs (empty until rollout per Decision 13). |
| `GET /v1/concepts/{slug}/` | `ConceptHub` | Single concept hub. |

## Glossary & translation program

| Endpoint | Kind | Returns |
|---|---|---|
| `GET /v1/glossary/` | `GlossaryIndex` | Full multilingual glossary. |
| `GET /v1/glossary/{term_id}/` | `GlossaryTerm` | Single term with all language renderings. |
| `GET /v1/translations/` | `TranslationIndex` | All Wheel of Heaven Translations (the `-woh` book family). |
| `GET /v1/translations/{slug}/` | `Translation` | Translation provenance: source text, glossary version, model versions, reviewer, divergences. |

## Search & context

| Endpoint | Kind | Returns |
|---|---|---|
| `GET /v1/search/` | `SearchIndex` | Pre-built Fuse.js-compatible client-side index. |
| `GET /v1/context/` | `Context` | Project overview + section directory. |
| `GET /v1/context/hypothesis/` | `ContextDocument` | The working hypothesis as prose for direct LLM ingestion. |
| `GET /v1/context/terminology/` | `ContextDocument` | Canonical terminology with do-not-use guidance. |
| `GET /v1/context/timeline/` | `ContextDocument` | The 12 precessional ages as prose. |
| `GET /v1/context/sources/` | `ContextDocument` | The source program — tiers, families, guardrails. |
| `GET /v1/context/method/` | `ContextDocument` | Claim types, six-source rule, editorial passes. |

## Meta (schema + enums)

| Endpoint | Kind | Returns |
|---|---|---|
| `GET /v1/schema/` | `SchemaIndex` | List of available kinds. |
| `GET /v1/schema/{kind}/` | `JSONSchema` | JSON Schema draft 2020-12 for the named kind. |
| `GET /v1/enums/` | `EnumIndex` | List of available enums. |
| `GET /v1/enums/{name}/` | `Enum` | Controlled vocabulary with values, labels, descriptions. |

Available enum names: `authority-tier`, `source-family`, `claim-type`,
`event-type`, `relation-to-wheel`, `stance`, `licensing-status`,
`translation-status`, `languages`.

Available schema kinds: `wiki-entry`, `timeline-entry`, `article`,
`dispatch`, `book`, `source`, `tradition-hub`, `concept-hub`,
`glossary-term`, `translation`, `library`.

## Multilingual mirror

Every endpoint above is also reachable under `/v1/{lang}/...` for the
9 supported languages. The library tree (books, traditions, chapters)
resolves localized titles and paragraph text from the underlying
multilingual data with English fallback. See
[Multilingual](@/reference/api/multilingual.md) for the full mirror
rules.

## Example call

```bash
curl https://api.wheelofheaven.world/v1/wiki/elohim/ \
  -H 'Accept: application/json'
```

returns a `WikiEntry` response with `body_html` containing the rendered
encyclopedia article and `extra.infobox` containing structured data
(Hebrew form, transliteration, civilizational age, etc.).
