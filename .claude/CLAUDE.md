# docs.wheelofheaven.world — project context

This repo is the **authoritative documentation site** for the Wheel of
Heaven project. Live at <https://docs.wheelofheaven.world>.

When working in **any** wheelofheaven repo, this is where to look for
canonical answers about content conventions, theme components, pipeline
operations, and the multi-repo architecture. Reach for the live site
URLs or for the markdown in `content/` before re-deriving anything from
scratch.

## What lives here

| Section                              | What                                                          |
|--------------------------------------|---------------------------------------------------------------|
| `content/getting-started/`           | Quickstart, conventions, project map, troubleshooting.        |
| `content/contributing/content/`      | Editorial standards: wiki entries, articles, library books, newsroom dispatches, translations, editorial passes. |
| `content/contributing/dev/`          | Developer docs: pipelines, CI/deploy, bifrost theme, social-broadcast, OG-image pipeline. |
| `content/architecture/`              | Multi-site overview, hosting + caching, indexing & SEO, performance. |
| **`content/components/`**            | **Bifrost component library — every reusable SCSS component, Tera macro, content shortcode, and design token, with code snippets and links to canonical call sites on www.wheelofheaven.world.** |
| `content/reference/`                 | Frontmatter, library book format, repository inventory, glossary, icon registry, changelog. |

The components section is the newest and the largest single addition.
When you need to know whether something is already a reusable component
in Bifrost — or how to use the `glass-cloud-card` / `glass-cloud-button`
mixins, the breadcrumb macros, the `wiki` / `library` shortcodes, etc. —
start there:

- Section landing: <https://docs.wheelofheaven.world/components/>
- Source: `content/components/`

## Stack

- **Zola** 0.22.1 (pinned via `mise.toml`)
- **Custom theme:** `themes/docs-theme/` — imports Bifrost SCSS tokens
  (palette, spacing, type) via `@forward "../../../bifrost/sass/abstracts/..."`
  so the docs site stays in visual lockstep with the main site.
- **Bifrost is mounted as a submodule** at `themes/bifrost/` (the same
  submodule the main site uses — pinned to the same SHA on deploy).
  The docs site does NOT activate Bifrost as its theme; it only consumes
  the tokens.
- **mise** for tool versioning and task definitions.
- **Cloudflare Pages** for hosting, watching `main`.

## Quick commands

```sh
mise install        # install zola at the pinned version
mise run serve      # dev server with live reload (port 1113 auto-picked)
mise run build      # one-off build into ./public
mise run check      # zola check (link validation, etc.)
```

The dev server picks the first free port starting at 1112 (so it doesn't
clash with the main site on 1199).

## Repository layout

```
docs.wheelofheaven.world/
├── config.toml
├── mise.toml
├── content/                    # markdown content (see table above)
├── data/                       # JSON data (icons.json synced from www)
├── scripts/                    # sync helpers: sync_icons.py, extract-git-dates.py
├── static/                     # static assets served at /
└── themes/
    ├── bifrost/                # SUBMODULE — tokens consumed via @forward
    └── docs-theme/             # active theme — templates + SCSS
        ├── sass/abstracts/
        │   ├── _tokens.scss        # @forwards Bifrost abstracts
        │   └── _section-colors.scss # section → accent map (add new sections here)
        ├── templates/
        │   ├── base.html
        │   ├── section.html
        │   ├── page.html
        │   ├── icon-registry.html  # live-renders /reference/icons/
        │   └── partials/
        │       └── sidebar.html    # NAV — add new top-level sections here
        └── …
```

## How to add a new top-level section

1. Create `content/<section>/_index.md` with frontmatter (`title`,
   `description`, `sort_by = "weight"`, `weight = N`).
2. Add `"<section>"` to the `top_level` array in
   `themes/docs-theme/templates/partials/sidebar.html`.
3. Add `"<section>": t.$<hue>-300,` to the `$section-accents` map in
   `themes/docs-theme/sass/abstracts/_section-colors.scss`.
4. Add weight-ordered pages under `content/<section>/` (or subsections).

The sidebar walks the `top_level` array in order, so position matters.

## Conventions

### Frontmatter

Every page sets `template = "page.html"` (or a custom template for
special renders like `icon-registry.html`). Standard fields:

```toml
+++
title = "Page title"
description = "150-160 char summary."
template = "page.html"
weight = 10
+++
```

For section indexes (`_index.md`):

```toml
+++
title = "Section title"
description = "…"
sort_by = "weight"
weight = 5

[extra]
summary = "Longer summary surfaced in landing-page meta."
+++
```

### Shortcode-escape gotcha — important

Zola processes shortcode tags inside **both** inline backticks AND
fenced code blocks. If you write a literal shortcode example, you MUST
escape it or the build fails.

**Paired (block) shortcodes** — escape as `{%/* … */%}`:

```markdown
{%/* definition(term="Elohim") */%}
body text
{%/* end */%}
```

**Inline (variable-style) shortcodes** — escape as `{{/* … */}}`:

```markdown
{{/* cite(id="1", text="[1]") */}}
{{/* figure(src="…", alt="…") */}}
```

Wrong escape syntax in either direction → cryptic Zola parse errors at
build time. The error message phrasing — "expected … an ignored inline
shortcode … or some text" — is the tell.

Inline mentions in prose: drop the braces entirely
(``the `definition` shortcode``, not ``the `{% definition %}` shortcode``).

### Linking to source files

When documenting a Bifrost component, link to its source on GitHub:

```markdown
[`themes/bifrost/sass/components/_glass-cloud-button.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_glass-cloud-button.scss)
```

`zola check` may report these as 404 due to GitHub rate-limiting against
its user-agent — the links work fine in browsers.

## Related repos

- `www.wheelofheaven.world` — the main site Bifrost styles.
- `bifrost` — the theme repo (submodule under `themes/bifrost/`).
- `api.wheelofheaven.world` — API service (documented under
  `content/reference/api/`).

When working on Bifrost components, document the change here as part of
the same PR — the docs site is the discoverability surface.
