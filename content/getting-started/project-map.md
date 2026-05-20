+++
title = "Project Map"
description = "What each Wheel of Heaven repository does, and how they connect — the 30-second tour."
weight = 20
+++

The Wheel of Heaven knowledge base spans ~19 repositories across one
GitHub organization. Most contributors only touch two or three. This
page shows the whole org at a glance so you can find the one you
actually need.

For the full per-repo details — directory layouts, URLs, etc. — see
[Repository Inventory](@/reference/repository-inventory.md). This page is
the *map*.

## The sites (the output)

Three production sites, each its own Cloudflare Pages project:

| Site | URL | What it is |
|---|---|---|
| **www** | [www.wheelofheaven.world](https://www.wheelofheaven.world) | The reading site — wiki, articles, library, timeline, news |
| **api** | [api.wheelofheaven.world](https://api.wheelofheaven.world) | Same content as JSON, for machines |
| **assets** | [assets.wheelofheaven.world](https://assets.wheelofheaven.world) | Image CDN — AVIF/WebP/JPG |
| **docs** | [docs.wheelofheaven.world](https://docs.wheelofheaven.world) | This site |

## The shared inputs (the source)

Both www and api read from the same content + theme submodules:

| Submodule | Repo | Used by | What's in it |
|---|---|---|---|
| `themes/bifrost` | `bifrost` | www, docs | Zola theme — templates, SCSS, JS |
| `content` | `data-content` | www, api | All markdown content, in 10 languages |
| `data/library` | `data-library` | www, api | Books as structured JSON |

So a single content change in `data-content` is picked up by both the
reading site and the API on the next submodule-pointer bump.

## Pipelines (the processing layers)

Three repos run pipelines that turn raw inputs into ship-ready outputs.
These are *not* submodules — they're standalone tools.

| Pipeline | Repo | Job |
|---|---|---|
| **Image** | `data-images` | Source images → AVIF/WebP/JPG + OG cards → push to assets CDN |
| **Cinematics** | `data-cinematics` | Source video loops → optimized WebM/AV1 → push to assets CDN |
| **Ingest** | `ingest` | Source PDFs/EPUBs → structured JSON → push to `data-library` |

## Authoring + automation

| Repo | Role |
|---|---|
| `.github` | Org-level GitHub profile + issue templates |
| `.claude` | AI-assistant context, project plans, roadmaps |
| `utilities` | Maintenance scripts (frontmatter munging, SEO audits, sitemap tools) |
| `epub.wheelofheaven` | EPUB build harness for the precessional-ages book |
| `data-sources` | (Private) Original PDF/EPUB material feeding `ingest` |
| `data-bibliography` | (Legacy) Initial bibliography, seeded `data/sources.json` |
| `raw-media` | Raw video loops + intermediate files for `data-cinematics` |
| `reference` | (Private) Visual reference / art inspiration |
| `genesis` | Standalone planet-builder prototype (not part of the site) |

## How things connect

```
                          ┌──────────────┐
                          │ data-content │  (markdown, 10 languages)
                          │ data-library │  (books JSON)
                          │   bifrost    │  (theme)
                          └──────┬───────┘
                                 │ git submodules
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
            ┌───────┐        ┌───────┐       ┌──────────┐
            │  www  │        │  api  │       │   docs   │
            └───┬───┘        └───┬───┘       └────┬─────┘
                │                │                │
                │   data-images → assets ◀────┐   │
                │   data-cinematics → assets   │   │
                │                              │   │
                ▼                ▼                ▼
            Cloudflare       Cloudflare       Cloudflare
            Pages            Pages            Pages
```

## Where to start, based on what you want to do

| Goal | Repo to clone | Then read |
|---|---|---|
| Add a wiki entry, edit prose, translate | `data-content` | [Content overview](@/contributing/content/overview.md) |
| Add a book to the library | `data-library` | [Library Book](@/contributing/content/library-book.md) |
| Add images to a page | `data-images` | [Pipelines → Image pipeline](@/contributing/dev/pipelines.md) |
| Theme / styling work | `bifrost` (via `www` for testing) | [Bifrost Theme](@/contributing/dev/bifrost-theme.md) |
| Site-level config, build chain, CI | `www.wheelofheaven.io` | [CI & Deploy](@/contributing/dev/ci-deploy.md) |
| API endpoints | `api.wheelofheaven.io` | [Architecture → Sites → api](@/architecture/sites/api.md) |
| Edit *these docs* | `docs.wheelofheaven.world` | (you're reading them) |

If you're not sure which one you need, start with
[Local Setup](@/contributing/dev/local-setup.md) — it walks through
cloning all the major ones.

## Why so many repos?

The split between `www` (site code) and `data-content` (content) lets
content authors work without touching site code, and vice-versa. Sharing
content as a submodule means the API and the reading site never diverge.
Pulling the theme out of the site repo means it could (in theory) be
reused. Most of the rest are pipelines that are conceptually independent
of the site itself — image processing, EPUB generation, PDF ingestion —
and benefit from their own scope.
