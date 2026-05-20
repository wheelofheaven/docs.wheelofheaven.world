+++
title = "Wheel of Heaven Docs"
description = "Author, contributor, and developer documentation for the Wheel of Heaven knowledge base."
sort_by = "weight"
+++

## What this site is built with

- **Generator:** [Zola](https://www.getzola.org/) 0.22.1
- **Theme:** `docs-theme` — a small new theme in this repo that imports
  Bifrost's design tokens via SCSS so palette + typography stay in sync
  with the [reading site](https://www.wheelofheaven.world)
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
