+++
title = "Contributing Code"
description = "Working on the Bifrost theme, build pipelines, CI, and deploy chain for the Wheel of Heaven sites."
sort_by = "weight"
weight = 20
template = "section.html"
+++

For people writing or modifying the code that turns the
[content repos](@/contributing/content/_index.md) into deployed sites.
The reading site, the JSON API, the asset CDN, and this docs site are
all Zola-built; the reading site is themed by Bifrost; image and video
pipelines are Python.

## Most contributors only touch one or two of these

| If you're working on… | Start here |
|---|---|
| Setting up the multi-repo dev environment | [Local Setup](@/contributing/dev/local-setup.md) |
| Templates, SCSS, shortcodes (Bifrost) | [Bifrost Theme](@/contributing/dev/bifrost-theme.md) |
| Image processing, OG cards, build pipeline | [Pipelines](@/contributing/dev/pipelines.md) |
| Cloudflare Pages, DNS, headers, redirects | [CI & Deploy](@/contributing/dev/ci-deploy.md) |

If you're starting cold, [Local Setup](@/contributing/dev/local-setup.md)
is the dependable entry point — it covers cloning each repo with the
right submodule flags, installing tools via `mise`, and running the
dev server.

## Bigger picture

Before touching code, the
[Architecture Overview](@/architecture/overview.md) is worth ten
minutes — it explains the submodule relationships, why the API and
www share content, and where things sit in the build chain.

## A few cross-cutting conventions

These apply across all the per-page guides below.

- **Submodules use SSH except when CI needs them.** `.gitmodules`
  entries that Cloudflare Pages must clone (bifrost) use HTTPS; the
  rest use SSH. See [Conventions](@/getting-started/conventions.md).
- **Zola version is pinned in `mise.toml`.** Each site repo also
  pins Zola in its Cloudflare Pages build command. When bumping,
  update both.
- **The build environment is Zola-only.** CF Pages downloads the
  Zola binary at build time via curl; no Rust toolchain on the
  runner. Build commands all follow the same shape — see
  [CI & Deploy](@/contributing/dev/ci-deploy.md).
