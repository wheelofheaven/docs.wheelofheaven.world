+++
title = "api.wheelofheaven.world"
description = "The static JSON API — Zola-generated endpoints serving every curated artefact in the corpus."
weight = 20
+++

The Wheel of Heaven API is a **static JSON twin of the public site**.
Every page on `www.wheelofheaven.world` has a deterministic JSON URL
on `api.wheelofheaven.world`, plus surfaces (bibliography, glossary,
translation provenance, schemas, controlled vocabularies) that don't
exist on www.

For the catalogue of every endpoint, the response envelope, controlled
vocabularies, and JSON Schemas, see [API Reference](@/reference/api/_index.md).

## Who this is for

The API exists so machines — AI agents, third-party integrations,
analytics, downstream sites — can read the same corpus the reading
site presents to humans. It is also the entry point we deliberately
expose to LLMs: every page has a JSON twin, and a handful of
`/v1/context/*` endpoints are curated as direct system-prompt material.

**This is not a database in front of an application server.** Every
URL is a static file, pre-built at deploy time from `data-content`,
`data-library`, and `data-bibliography`. No queries, no auth, no rate
limits beyond Cloudflare's edge.

## Overview

- **URL:** <https://api.wheelofheaven.world>
- **Generator:** Zola (with a Python prebuild step)
- **Hosting:** Cloudflare Pages (migrated from GitHub Pages in May 2026)
- **Format:** JSON, static, CC0-1.0
- **Versioning:** strictly additive within `/v1/`. Breaking changes
  earn `/v2/`. Decision 14 of
  [`strategy-decisions.md`](https://github.com/wheelofheaven/wheelofheaven/blob/main/.claude/plans/strategy-decisions.md)
  locks v1 URLs forever.

## Design principles

The full shape is documented in the org-level strategy doc
[`strategy-api.md`](https://github.com/wheelofheaven/wheelofheaven/blob/main/.claude/plans/strategy-api.md).
The principles in one line each:

1. **Static, file-backed, pre-built.** No query engine, no runtime
   logic. Every URL is a deterministic file.
2. **Resource-noun naming.** URLs name what consumers want
   (`/books/`, `/wiki/`, `/sources/`), not the storage warehouse.
3. **One way to do everything.** Each fact has one canonical URL.
4. **URL permanence for v1.** Shipped paths never break.
5. **Same envelope everywhere.** `{ apiVersion, kind, metadata, data,
   links }` for every endpoint.
6. **Multilingual by path prefix.** English at `/v1/...`, others at
   `/v1/{lang}/...`.
7. **Self-describing.** A consumer with just the root URL can walk
   the entire surface — manifest, schemas, enums, sitemap, llms.txt.
8. **AI-first metadata, not AI-only.** Same envelope serves humans,
   scripts, and LLMs; `/v1/context/*` adds curated narrative summaries
   for direct LLM ingestion.

## How it's built

The API repo is `wheelofheaven/api.wheelofheaven.world`. Build steps:

1. **`python3 scripts/prebuild.py`** — reads
   `data/content/` (wiki, timeline, articles, news, tradition hubs),
   `data/library/` (the 100+ books), and `data/bibliography/`
   (67 source records). Writes per-section index data to
   `data/extracted/` and one Zola content page per entry under
   `content/v1/`. For non-default languages it walks
   `data/content/{lang}/` and emits to `content/v1/{lang}/`. The
   generated content files are gitignored.

2. **`zola build`** — Zola renders every content page through its
   bound `template = "v1-*.json"` template, producing one
   `index.html` per endpoint containing JSON.

3. **`bash scripts/postbuild.sh`** — writes `_headers` for proper
   `Content-Type: application/json` + CORS + cache TTLs, and writes
   `_redirects` so directory URLs are canonical and explicit-extension
   URLs (`/v1/.../index.json`) rewrite to the directory form (200,
   no actual file mirror).

The pipeline runs on every push to `main` and on the Cloudflare Pages
build hook.

### Deployment file-count budget

The API has the largest page count of any Wheel of Heaven site and
is the one closest to Cloudflare Pages' **20,000-file deployment
cap**. Current builds sit at ~3,700 files (well under), but two
design choices keep it there:

1. The postbuild does **not** mirror every `index.html` as a sibling
   `index.json` — `_redirects` does the same job via a rewrite rule
   without doubling the file count.
2. Per-language library mirrors (`/v1/{lang}/library/...`) are
   filtered to books whose catalog `availableLangs` includes
   `{lang}`. Without that filter, 9 languages × ~2,000 English pages
   = ~18,000 extra files, which crosses the cap.

Before merging changes that add a new content surface or mirror, run
`mise run build && find public -type f | wc -l` locally. If the
result is above ~15,000, plan the additional surface carefully. See
[Hosting and Caching → CF Pages 20,000-file deployment cap](@/architecture/hosting-and-caching.md)
for the failure mode and the working patterns.

## Data sources

| Source repo | What | API surface |
|---|---|---|
| `data-content` | wiki, timeline, articles, news, tradition hubs, i18n glossary | `/v1/wiki/`, `/v1/timeline/`, `/v1/articles/`, `/v1/news/`, `/v1/sources/traditions/`, `/v1/glossary/` |
| `data-library` | catalog + 100+ books with chapter/verse JSON | `/v1/library/books/`, `/v1/library/traditions/`, `/v1/translations/` (for the `-woh` family) |
| `data-bibliography` | 67 structured source records | `/v1/sources/` |

The same submodules feed www. The two sites are independent Zola
builds reading the same canonical data.

## URL conventions

- `/v1/{kind}/` returns the listing for that kind.
- `/v1/{kind}/{slug}/` returns the individual item.
- `/v1/{lang}/{kind}/[{slug}/]` returns the same in another language.
- Every directory URL also responds at `/v1/{kind}/index.json` and
  `/v1/{kind}/{slug}/index.json` (historical canonical form).

## Caching

| Surface | Cache TTL |
|---|---|
| `/v1/schema/*`, `/v1/enums/*`, `/v1/context/*` | 24 hours |
| `/v1/wiki/*`, `/v1/timeline/*`, `/v1/articles/*`, `/v1/library/*`, etc. | 1 hour |
| `robots.txt`, `sitemap.xml`, `llms.txt` | default (1 hour) |

Cloudflare purges the entire zone on each successful deploy.

## Discoverability

- Every consumer endpoint links back to `/v1/` (manifest),
  `/v1/schema/{kind}/` (its schema), and the relevant `/v1/enums/`.
- `/llms.txt` (API-side) is a short manifest pointing AI agents at
  `/v1/context/*` and `/v1/`.
- Every www HTML page carries a `<link rel="alternate"
  type="application/json">` pointing to its API twin.

## Related

- [API Reference](@/reference/api/_index.md) — tabular endpoint
  catalogue, envelope spec, enum and schema reference.
- [Hosting and Caching](@/architecture/hosting-and-caching.md) — how
  every site is cached.
- [CI & Deploy](@/contributing/dev/ci-deploy.md) — the build and
  deploy chain.
