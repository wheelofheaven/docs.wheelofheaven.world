+++
title = "Wheel of Heaven Docs"
description = "Author, contributor, and developer documentation for the Wheel of Heaven knowledge base."
sort_by = "weight"
+++

The technical and editorial documentation for the
[Wheel of Heaven](https://www.wheelofheaven.world) knowledge base —
how to contribute content, how to work on the code, and how the
~19-repo organization fits together.

Three audiences live here. Pick the one that fits.

## Content authors / translators

You write or translate wiki entries, Articles, Newsroom Dispatches, or
library entries.

- **Start with** [Quickstart](@/getting-started/quickstart.md) — clone,
  build, preview in under five minutes
- **Then read** [Content Overview](@/contributing/content/overview.md)
- **Per content type:**
  [Wiki Entry](@/contributing/content/wiki-entry.md) ·
  [Article](@/contributing/content/article.md) ·
  [Newsroom Dispatch](@/contributing/content/newsroom-dispatch.md) ·
  [Library Book](@/contributing/content/library-book.md)
- **Translating:** [Translations](@/contributing/content/translations.md)
- **Reference:** [Frontmatter](@/reference/frontmatter.md) ·
  [Editorial Passes](@/contributing/content/editorial-passes.md)

## Theme / tooling developers

You work on Bifrost (the theme), the pipelines (image, content, build),
or the deploy chain.

- **Start with** [Quickstart](@/getting-started/quickstart.md), then
  [Local Setup](@/contributing/dev/local-setup.md)
- **The theme:** [Bifrost Theme](@/contributing/dev/bifrost-theme.md)
- **The pipelines:** [Pipelines](@/contributing/dev/pipelines.md)
- **CI/CD:** [CI & Deploy](@/contributing/dev/ci-deploy.md)
- **Conventions:** [Conventions](@/getting-started/conventions.md)

## Architecture readers

You want to understand how the project fits together before contributing
to anything in particular.

- **Start with** [Architecture Overview](@/architecture/overview.md)
- **Then** [Project Map](@/getting-started/project-map.md)
- **Per site:** [www](@/architecture/sites/www.md) ·
  [api](@/architecture/sites/api.md) ·
  [assets](@/architecture/sites/assets.md)
- **Operations:** [Hosting and Caching](@/architecture/hosting-and-caching.md)
- **Repo inventory:** [Repository Inventory](@/reference/repository-inventory.md)

## What this site is built with

- **Generator:** [Zola](https://www.getzola.org/) 0.22.1
- **Theme:** `docs-theme` — a small new theme in this repo that imports
  Bifrost's design tokens via SCSS so palette + typography stay in sync
  with the reading site
- **Search:** [Fuse.js](https://fusejs.io/) (Cmd/Ctrl-K to focus)
- **Hosting:** Cloudflare Pages, built directly from `main`

Source: [github.com/wheelofheaven/docs.wheelofheaven.world](https://github.com/wheelofheaven/docs.wheelofheaven.world).
License: CC0-1.0 (Public Domain).

## Rollout

This site launched on 2026-05-20. The five-phase rollout plan
(in [`.claude/plans/docs-site.md`](https://github.com/wheelofheaven/.claude/blob/main/plans/docs-site.md))
is complete:

| Phase | What | |
|---|---|---|
| 1 | Bootstrap & deploy pipeline | ✓ |
| 2 | Theme buildout (sidebar nav, sticky ToC, code-block chrome, search) | ✓ |
| 3 | Migrate & restructure existing content from the old `docs` repo | ✓ |
| 4 | Write the missing connective tissue (Quickstart, Project Map, the per-content-type how-tos, frontmatter reference) | ✓ |
| 5 | Cutover (archive old docs repo, update cross-references in `.github` and bifrost footer) | ✓ |

The old `wheelofheaven/docs` repo is archived; this site is where
docs work happens now.
