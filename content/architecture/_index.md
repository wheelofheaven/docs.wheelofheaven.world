+++
title = "Architecture"
description = "How the ~19-repo Wheel of Heaven organization fits together — sites, submodules, pipelines, and hosting."
sort_by = "weight"
weight = 30
template = "section.html"
+++

This section is the system view. Start here when you want to
understand *why* things are where they are — not how to write a wiki
entry or where to file a bug, but how the pieces compose.

## Start with the overview

The [Architecture Overview](@/architecture/overview.md) has the
canonical diagram and decision rationale. Read it once; the rest of
this section drills into specific corners.

## Then go where you need

- **[Sites](@/architecture/sites/_index.md)** — the three production
  Cloudflare Pages projects (www, api, assets) plus this docs site,
  with per-site config, build commands, and feature notes.
- **[Hosting and Caching](@/architecture/hosting-and-caching.md)** —
  what gets cached where, with TTLs by asset type, how cache
  invalidation works on deploy, and how to debug a stale-content
  bug at the edge.
- **[Performance](@/architecture/performance.md)** — the three
  landing-page LCP techniques (preload, critical CSS gate, poster
  sizing), the current Lighthouse scores, and how to keep them.
- **[Indexing & Multilingual SEO](@/architecture/indexing.md)** — how
  hreflang is built from a manifest rather than Zola's native
  translations, the redirect strategy in `_redirects`, and the
  current Search Console state.

For a flat list of every repo in the org, what each one holds, and
the GitHub URLs, the
[Repository Inventory](@/reference/repository-inventory.md) under
Reference is the authoritative catalogue.

## A note on what's in this section vs. Reference

**Architecture pages** explain *how things fit together* — the
diagrams, the rationale, the data flow. **Reference pages** are the
*flat catalogues* — frontmatter fields, repository list, file
formats. If you're trying to understand a system, start here. If
you're looking up a value, start at Reference.
