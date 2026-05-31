+++
title = "API endpoints for AI agents"
description = "Which api.wheelofheaven.world endpoints are best for AI ingestion — the AI-relevant subset of the surface, with payload shapes and example calls."
weight = 30
template = "page.html"

[extra]
summary = "The AI-relevant subset of the JSON API — the discovery endpoints, the curated context surfaces, the per-page twins, and the meta endpoints. Includes payload shapes, example calls, and the response envelope you can rely on."
+++

The full API endpoint catalogue lives at
[API Reference → Endpoints](@/reference/api/endpoints.md). This page is
the **AI-oriented subset** — the endpoints that matter when you're
building an agent, a RAG pipeline, or any system that needs to read the
corpus programmatically.

For the why and how of the API itself (build pipeline, design
principles, hosting), see
[Architecture → API](@/architecture/sites/api.md).

## The response envelope, briefly

Every response shares the shape:

```json
{
  "apiVersion": "v1",
  "kind": "WikiEntry",
  "metadata": {
    "slug": "elohim",
    "lang": "en",
    "permalink": "https://api.wheelofheaven.world/v1/wiki/elohim/"
  },
  "data": { /* kind-specific payload */ },
  "links": {
    "self": "/v1/wiki/elohim/",
    "schema": "/v1/schema/wiki-entry/",
    "manifest": "/v1/",
    "html": "https://www.wheelofheaven.world/wiki/elohim/"
  }
}
```

Every consumer endpoint exposes a `links.schema` pointer and a
`links.html` pointer to the human-readable twin. An ingesting agent can
walk the entire surface from `/v1/` alone. See
[API Reference → Envelope](@/reference/api/envelope.md) for the full
spec.

## The AI-priority endpoints

### 1. Discovery

Hit these once at boot to learn the surface.

| Endpoint | What |
|---|---|
| [`GET /v1/`](https://api.wheelofheaven.world/v1/) | v1 manifest — every endpoint family with cross-links |
| [`GET /llms.txt`](https://api.wheelofheaven.world/llms.txt) | API-side LLM manifest (concise) |
| [`GET /sitemap.xml`](https://api.wheelofheaven.world/sitemap.xml) | Every endpoint URL with `<lastmod>` |
| [`GET /v1/schema/`](https://api.wheelofheaven.world/v1/schema/) | Index of available JSON Schemas |
| [`GET /v1/enums/`](https://api.wheelofheaven.world/v1/enums/) | Index of controlled vocabularies |

### 2. Curated context (highest signal-to-token)

These six endpoints are designed for direct system-prompt ingestion.
Each returns a `ContextDocument` with a `data.body` field of plain
prose. See
[Curated context endpoints](@/ai-ingestion/context-endpoints.md) for the
full per-endpoint breakdown.

| Endpoint | ~Tokens | What |
|---|---|---|
| [`GET /v1/context/`](https://api.wheelofheaven.world/v1/context/) | ~500 | Overview + sub-context map |
| [`GET /v1/context/hypothesis/`](https://api.wheelofheaven.world/v1/context/hypothesis/) | ~1,500 | The working hypothesis |
| [`GET /v1/context/terminology/`](https://api.wheelofheaven.world/v1/context/terminology/) | ~1,200 | Canonical terms + do-not-use table |
| [`GET /v1/context/timeline/`](https://api.wheelofheaven.world/v1/context/timeline/) | ~2,000 | The twelve precessional ages |
| [`GET /v1/context/sources/`](https://api.wheelofheaven.world/v1/context/sources/) | ~1,500 | Six-tier authority model |
| [`GET /v1/context/method/`](https://api.wheelofheaven.world/v1/context/method/) | ~1,000 | Claim types, six-source rule, editorial passes |

Boot pattern:

```python
import httpx

KEYS = ["hypothesis", "terminology", "timeline", "sources", "method"]
ctx = {
    k: httpx.get(f"https://api.wheelofheaven.world/v1/context/{k}/")
       .json()["data"]["body"]
    for k in KEYS
}
```

### 3. Per-page twins (per-query retrieval)

Each of these gives you the body of a single page, plus its structured
metadata. Hit them on demand from a retrieval layer or tool call.

| Endpoint family | Kind | Best for |
|---|---|---|
| [`/v1/wiki/{slug}/`](https://api.wheelofheaven.world/v1/wiki/) | `WikiEntry` | Definitional queries ("what is Elohim") |
| [`/v1/timeline/{slug}/`](https://api.wheelofheaven.world/v1/timeline/) | `TimelineEntry` | Deep-history / chronology queries |
| [`/v1/articles/{slug}/`](https://api.wheelofheaven.world/v1/articles/) | `Article` | Long-form thesis on a topic |
| [`/v1/news/{slug}/`](https://api.wheelofheaven.world/v1/news/) | `Dispatch` | Recent-event-through-canon reads |

Each per-page endpoint returns `data.body_html` (rendered HTML), plus
the page's `extra` table (frontmatter), plus relationships
(`see_also`, `references`, `external_links`, etc.). For LLM
consumption, you usually want either the HTML stripped to text or the
`extra.summary` field.

Example:

```bash
curl https://api.wheelofheaven.world/v1/wiki/elohim/ | jq '.data | {
    title: .title,
    summary: .extra.summary,
    claim_type: .extra.claim_type,
    body_html
}'
```

### 4. Library — primary texts at chapter/verse granularity

Library books are different from other content surfaces in that they
have **chapter and verse structure**. Each chapter is a separate
endpoint. See [Library and sources](@/ai-ingestion/library-and-sources.md)
for the full deep-dive.

| Endpoint | Returns |
|---|---|
| `GET /v1/library/books/` | All ~100 books with slug, code, tradition, chapter count |
| `GET /v1/library/books/{slug}/` | Single book + chapter index |
| `GET /v1/library/books/{slug}/meta` | Lightweight metadata only |
| `GET /v1/library/books/{slug}/chapters/{n}` | Single chapter with verses + refIds |
| `GET /v1/library/traditions/` | Tradition shelves (e.g. raelian, biblical, mesopotamian) |

### 5. Sources — bibliography records

When you need to know what authority a claim rests on, hit the
bibliography endpoint.

| Endpoint | Returns |
|---|---|
| [`GET /v1/sources/`](https://api.wheelofheaven.world/v1/sources/) | All 67 source records with authority_tier, family, stance |
| `GET /v1/sources/{id}/` | Full record with licensing, library_slug cross-link |
| [`GET /v1/sources/traditions/`](https://api.wheelofheaven.world/v1/sources/traditions/) | Tradition hubs (why each tradition is included) |

### 6. Glossary

Multilingual terminology. Useful when your application surfaces the
project in a non-English language.

| Endpoint | Returns |
|---|---|
| [`GET /v1/glossary/`](https://api.wheelofheaven.world/v1/glossary/) | Full multilingual glossary |
| `GET /v1/glossary/{term_id}/` | Single term with all 9 language renderings |

### 7. Translation provenance

For the `-woh` Wheel of Heaven Translations (project-internal
re-translations of source texts), the provenance is exposed.

| Endpoint | Returns |
|---|---|
| [`GET /v1/translations/`](https://api.wheelofheaven.world/v1/translations/) | All WoH Translations |
| `GET /v1/translations/{slug}/` | Source text, glossary version, model versions, reviewer, divergences |

If your application surfaces a WoH Translation, **always pair the text
with the provenance** — the source family of the original, the
glossary version used, and the reviewer.

### 8. Search index (client-side retrieval)

If you're building an in-browser agent or want a small embedded index,
the API publishes a pre-built Fuse.js-compatible index:

```bash
curl https://api.wheelofheaven.world/v1/search/
```

The index covers wiki, timeline, articles, library, and sources. It is
~1MB JSON, suitable for in-browser fuzzy search. For server-side
embedding retrieval, see
[Embeddings and RAG](@/ai-ingestion/embeddings-and-rag.md).

### 9. Meta — schemas and enums

If your agent generates structured output (e.g. "build me a wiki
entry"), validate against the published schema:

```bash
curl https://api.wheelofheaven.world/v1/schema/wiki-entry/
curl https://api.wheelofheaven.world/v1/enums/claim-type/
```

Available schemas: `wiki-entry`, `timeline-entry`, `article`,
`dispatch`, `book`, `source`, `tradition-hub`, `concept-hub`,
`glossary-term`, `translation`, `library`.

Available enums: `authority-tier`, `source-family`, `claim-type`,
`event-type`, `relation-to-wheel`, `stance`, `licensing-status`,
`translation-status`, `languages`.

## Multilingual access

Every endpoint above is mirrored under `/v1/{lang}/...` for de, fr, es,
ru, ja, zh, zh-Hant, ko. See
[API Reference → Multilingual](@/reference/api/multilingual.md).

```bash
curl https://api.wheelofheaven.world/v1/de/wiki/elohim/
curl https://api.wheelofheaven.world/v1/ja/timeline/age-of-leo/
```

The default English path (no language prefix) is the authoritative
source for editorial discipline. Translations are derived from
English and may lag a single editorial pass.

## Caching and freshness

| Surface | TTL |
|---|---|
| `/v1/schema/*`, `/v1/enums/*`, `/v1/context/*` | 24 hours |
| `/v1/wiki/*`, `/v1/timeline/*`, `/v1/articles/*`, `/v1/library/*` | 1 hour |
| `/llms.txt`, `/sitemap.xml`, `/robots.txt` | 1 hour |

Cloudflare purges the entire zone on each deploy, so the upper bound
on staleness is the cache TTL, not the time since the last edit.

For a long-running agent, hit `/v1/context/*` at boot and cache for the
session. Hit per-page endpoints on demand and cache for 1 hour.

## Rate limiting and auth

There is **no auth** and **no application-level rate limiting**.
Cloudflare's edge protection applies — if you're hammering the API
aggressively, the right pattern is to mirror the data locally via
[`/v1/`](https://api.wheelofheaven.world/v1/) walking the sitemap.

For a one-time mirror:

```bash
wget --recursive --no-parent --accept '*.json' \
     https://api.wheelofheaven.world/v1/
```

This works because every endpoint is a static file. The mirror is
~50MB and self-consistent at the time you pulled it.

## Common pitfalls

- **Don't strip the `links` block.** It contains the schema pointer
  and the `html` twin URL, which downstream consumers may need.
- **Don't treat `body_html` as Markdown.** It is rendered HTML. Strip
  to text or render as HTML; don't try to re-parse as Markdown.
- **Watch the `extra` shape.** Frontmatter is page-type specific.
  Wiki entries have `extra.infobox`; library books have `extra.book`;
  dispatches have `extra.event_date`. Use the schema endpoint to
  introspect.
- **Translations may lag.** Non-English endpoints follow the English
  by an editorial cycle. If a wiki entry has been rewritten in the
  current pass but not retranslated, you'll see the previous-pass
  version under `/v1/{lang}/...`.
