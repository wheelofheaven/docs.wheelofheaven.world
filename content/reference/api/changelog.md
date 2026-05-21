+++
title = "Changelog"
description = "Version history of api.wheelofheaven.world — and the versioning policy that constrains future changes."
weight = 60
+++

## Versioning policy

The API uses **stable v1 with additive growth** (Decision 14 of
strategy-decisions.md):

- URLs under `/v1/` are permanent. Once a URL ships, it never changes
  its shape or disappears.
- **Additive changes** (new optional fields, new endpoints, new
  enum values) land under `/v1/` without notice.
- **Breaking changes** (removing fields, changing types, renaming
  enum values, changing URL paths) require `/v2/`. v1 keeps responding.

The same constraint applies to JSON Schemas: schemas may add optional
fields freely; required fields are part of the v1 contract.

## Releases

### v1.1 — 2026-05-21

Major redesign / coverage expansion.

**Added**

- `/v1/wiki/{slug}/`, `/v1/timeline/{slug}/`, `/v1/articles/{slug}/`,
  `/v1/news/{slug}/` — individual-entry endpoints with `body_html`.
- `/v1/sources/` + `/v1/sources/{id}/` — bibliography surface,
  consuming data-bibliography.
- `/v1/sources/traditions/` + `/v1/sources/traditions/{slug}/` —
  tradition hubs.
- `/v1/concepts/` — concept-hub index (empty pending content rollout).
- `/v1/glossary/` + `/v1/glossary/{term_id}/` — multilingual glossary.
- `/v1/translations/` + `/v1/translations/{slug}/` — WoH translation
  provenance.
- `/v1/library/`, `/v1/library/books/`, `/v1/library/traditions/` —
  library namespace (aliases of `/v1/catalog/`, `/v1/books/`,
  `/v1/traditions/` which remain).
- `/v1/context/sources/`, `/v1/context/method/` — additional
  AI-oriented narrative endpoints.
- `/v1/schema/` + `/v1/schema/{kind}/` — JSON Schemas for every kind.
- `/v1/enums/` + `/v1/enums/{name}/` — controlled vocabularies.
- Multilingual mirror under `/v1/{lang}/...` for 8 non-default
  languages.
- API-side `/llms.txt`.

**Changed**

- `/v1/wiki/` and `/v1/timeline/` now return `data: [...]` in the
  envelope (previously the entries lived as a top-level `entries`
  field outside `data`, which was the bug behind the `data: null`
  appearance in the old responses).
- All responses now include `metadata.language` and
  `metadata.schemaUrl`.
- Response headers now include `X-License`, `X-Citable`, `X-API-Version`.
- Directory URLs (`/v1/wiki/elohim/`) are now canonical; the legacy
  `/index.json` form is preserved as an alias.

**Infrastructure**

- Migrated from GitHub Pages to Cloudflare Pages (clean URL support
  via `_headers` + `_redirects`).
- Hooked `scripts/prebuild.py` into both `mise run build` and the
  GitHub Actions deploy workflow (it was being skipped previously).
- Submodules now track `main` explicitly via `branch = main` in
  `.gitmodules`.

### v1.0 — 2026-01

Initial API release with `/v1/wiki/`, `/v1/timeline/`, `/v1/catalog/`,
`/v1/books/`, `/v1/books/{slug}/`, `/v1/traditions/`, `/v1/search/`,
and the four `/v1/context/*` endpoints.

## Deprecations

None. URL permanence means nothing under `/v1/` is deprecated.
Aliases (e.g. `/v1/books/` for `/v1/library/books/`) will be
maintained for the lifetime of v1.

## Pre-announced changes

None pending.
