+++
title = "Repository Inventory"
description = "Every repository in the Wheel of Heaven GitHub organization — what it is, where it lives, and what depends on what."
weight = 20
+++

Complete inventory of Wheel of Heaven repositories.

## Core repositories

### www.wheelofheaven.io

Deployed at `www.wheelofheaven.world`. The main public-facing knowledge
base.

```
www.wheelofheaven.io/
├── config.toml              # Zola configuration
├── mise.toml                # task runner config
├── content/                 # → data-content (submodule)
├── data/
│   └── library/             # → data-library (submodule)
├── themes/
│   └── bifrost/             # → bifrost (submodule)
├── static/
│   ├── brand/               # logos, favicons
│   ├── fonts/               # web fonts
│   └── map/                 # interactive map assets
└── .github/workflows/
    └── deploy.yml
```

**Languages:** 10 (en, de, fr, es, ru, ja, zh, zh-Hant, ko, he — Hebrew renders RTL).

### api.wheelofheaven.io

Deployed at `api.wheelofheaven.world`. JSON API for programmatic access.

```
api.wheelofheaven.io/
├── config.toml
├── mise.toml
├── content/v1/              # API version 1
│   ├── wiki/
│   ├── timeline/
│   ├── traditions/
│   └── search/
├── data/
│   ├── content/             # → data-content (submodule)
│   ├── library/             # → data-library (submodule)
│   └── extracted/           # pre-built JSON from content
├── scripts/
│   └── prebuild.py
├── static/
│   └── _headers             # CORS headers
└── templates/
    └── v1-*.json            # API response templates
```

**Endpoints:** `/v1/wiki/`, `/v1/timeline/`, `/v1/traditions/`, `/v1/search/`.

### bifrost

Zola theme for the Wheel of Heaven sites.

```
bifrost/
├── theme.toml
├── README.md
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── *-section.html
│   ├── *-page.html
│   ├── macros/
│   ├── partials/
│   │   ├── schema/          # JSON-LD schemas
│   │   └── icons/           # SVG icons
│   └── shortcodes/
├── sass/                    # SCSS (7-1 architecture)
│   ├── abstracts/
│   ├── base/
│   ├── components/
│   ├── layout/
│   ├── pages/
│   └── themes/
└── static/
    └── js/
```

**Stats:** 9 shortcodes, 28 templates, 12 JS modules.

### core

The durable research corpus and conceptual specification. Authoritative for
what the framework claims and how those claims are reasoned — framework claim
records, evidence maps, source notes, methodology, RFCs, and decisions — kept
deliberately separate from the reading site, the source texts, and the
bibliography. Public pages bind to a core claim at an exact version
(`core_claim_ids` / `core_versions` in `[extra]`); the validator flags a page
that drifts from its controlling record. Since the derivation contract was
accepted, new artifacts ground their load-bearing claims here *before* the
prose is written — see
[Grounded Production](@/contributing/content/grounded-production.md).
Markdown- and JSON-first, no build step beyond `python3 scripts/validate.py`.

```
core/
├── docs/
│   ├── foundations/        # scope, epistemic principles, architecture
│   ├── framework/          # human-readable claim specifications
│   ├── evidence/           # passage-level evidence maps
│   ├── methodology/        # claim model, evidence status, comparison, versioning
│   └── research/           # agenda + open research questions
├── model/
│   ├── catalog.json        # claim index
│   ├── claims/             # machine-readable claim records
│   └── schemas/            # JSON Schemas
├── source-notes/           # source access + interpretation, keyed to Wheel source IDs
├── depictions/             # visual/scenic canon per entity or scene (accepted, pending pilot)
├── rfcs/                   # proposals
├── decisions/              # ADRs
└── scripts/validate.py     # cross-file + registry + publication-integration checks
```

**Status:** `0.1.0` foundation and pilot — four draft framework claims
(Elohim-civilization hypothesis, Anunnaki–Elohim identity, precessional
world-age chronology, Greek theomachy as conflict memory). Governance: RFCs
0001–0004 all accepted; the derivation contract (RFC 0003 / ADR 0002) and
depiction notes (RFC 0004 / ADR 0003) were adopted 2026-08-15.

## Data repositories

### data-content

Markdown content shared via submodules.

```
data-content/
├── wiki/                    # encyclopedia entries
├── timeline/                # precessional age pages
├── library/                 # sacred and primary texts
├── articles/                # long-form essays (idea-driven)
├── news/                    # newsroom dispatches (event-driven)
├── sources/                 # bibliography section index
├── de/                      # German translations
├── es/                      # Spanish
├── fr/                      # French
├── ja/                      # Japanese
├── ko/                      # Korean
├── ru/                      # Russian
├── zh/                      # Simplified Chinese
├── zh-Hant/                 # Traditional Chinese
├── he/                      # Hebrew (RTL)
├── i18n/
│   └── glossary.json
├── scripts/
│   ├── validate.py
│   └── i18n_dashboard.py
└── .github/workflows/
    └── validate.yml
```

### data-library

Book data in structured JSON. See
[Library Book Format](@/reference/library-book-format.md) for the schema.

```
data-library/
├── catalog.json
└── the-book-which-tells-the-truth/
    ├── _meta.json
    ├── chapter-1.json
    ├── chapter-2.json
    └── ...
```

### data-images

Image processing pipeline (responsive AVIF/WebP/JPEG; OG cards across 10
languages).

```
data-images/
├── raw/                     # original images
├── processed/               # optimized output (per-format trees)
├── og/                      # Open Graph image renderer (Playwright + Jinja)
│   ├── scripts/
│   ├── templates/
│   └── manifest.yaml
└── scripts/                 # process + sync to assets repo
```

### data-cinematics

Video asset pipeline. Converts source loops to optimized WebM (AV1) for web
delivery.

### data-sources (private)

Serves two distinct functions with different legal profiles.

**Pipeline inputs** — original PDF/EPUB source material used by the ingest
pipeline to produce structured book JSON for data-library. Restricted to
material the project may lawfully publish.

**Research holdings** (`holdings/`) — a registry of the copies the project
holds or has consulted: purchased books, downloaded scans, borrowed volumes,
archive scans read in place. One JSON record per copy, keyed to the same Wheel
source ID used by the bibliography and by core. Records the *identity* of a
copy — edition, pagination basis, checksum, and a per-locator verification log
— not its contents. **Payloads are not committed by default**: in-copyright
works use `storage: local_only`, so the bytes stay on the founder's disk while
the metadata and verification history are versioned.

The registry exists to make core's `access` levels honest and improvable.
Holding a copy licenses consultation, verification, and short quotation with
locators — not republication or redistribution; digitization into data-library
remains restricted to publishable material. `scripts/wantlist.py` derives an
acquisition list from core, separating "already held, go read it" from "not
held, acquire to unblock". Proposed in core RFC 0005 (draft).

### data-bibliography (legacy)

Original bibliography record repository. Seeded `data/sources.json` on first
build of the new JSON-driven `/sources/` pipeline; no longer a submodule of
the site. Kept in the org as a historical record.

### assets.wheelofheaven.io

Cloudflare-served static asset repository (images, OG cards, brand assets).
Populated by the sync scripts in `data-images/` and `data-cinematics/`.

## Support repositories

### docs.wheelofheaven.world

This site.

### docs (archived)

The pre-site docs repository. Markdown only, browse-on-GitHub. Lives on
as historical record after the migration to `docs.wheelofheaven.world`.

### .claude

AI assistant context, plans, and roadmaps.

### .github

Organization profile + issue templates.

### utilities

One-off maintenance scripts (frontmatter munging, SEO audit, sitemap tools).

### reference (private)

Visual reference collection (art inspiration).

### epub.wheelofheaven

EPUB build harness for the Wheel of Heaven timeline — twelve precessional
ages plus prologue/epilogue, generated from the same Markdown that powers
the timeline section on the site.

### ingest

PDF → structured JSON ingestion pipeline. Feeds `data-library` from
`data-sources`.

### raw-media

Raw video loops and intermediate files. Source tree for `data-cinematics`.

### genesis

Standalone planet-builder game prototype (not part of the knowledge-base
site).

## Repository URLs

| Repo | URL |
|------|-----|
| www | <https://github.com/wheelofheaven/www.wheelofheaven.io> |
| api | <https://github.com/wheelofheaven/api.wheelofheaven.io> |
| assets | <https://github.com/wheelofheaven/assets.wheelofheaven.io> |
| bifrost | <https://github.com/wheelofheaven/bifrost> |
| core | <https://github.com/wheelofheaven/core> |
| data-content | <https://github.com/wheelofheaven/data-content> |
| data-library | <https://github.com/wheelofheaven/data-library> |
| data-images | <https://github.com/wheelofheaven/data-images> |
| data-cinematics | <https://github.com/wheelofheaven/data-cinematics> |
| data-sources | <https://github.com/wheelofheaven/data-sources> (private) |
| data-bibliography | <https://github.com/wheelofheaven/data-bibliography> (legacy) |
| docs.wheelofheaven.world | <https://github.com/wheelofheaven/docs.wheelofheaven.world> |
| docs (archived) | <https://github.com/wheelofheaven/docs> |
| .claude | <https://github.com/wheelofheaven/.claude> |
| .github | <https://github.com/wheelofheaven/.github> |
| utilities | <https://github.com/wheelofheaven/utilities> |
| reference (private) | <https://github.com/wheelofheaven/reference> |
| epub.wheelofheaven | <https://github.com/wheelofheaven/epub.wheelofheaven> |
| ingest | <https://github.com/wheelofheaven/ingest> |
| raw-media | <https://github.com/wheelofheaven/raw-media> |
| genesis | <https://github.com/wheelofheaven/genesis> |
