# docs.wheelofheaven.world Codex Instructions

This repository is the authoritative documentation site for Wheel of Heaven.

Read `../AGENTS.md` first for workspace-wide GitHub account isolation and
project conventions. The previous Claude Code context is
`.claude/CLAUDE.md`; it remains authoritative for docs-site work.

## Stack

- Zola 0.22.1 pinned through `mise.toml`.
- Custom active theme in `themes/docs-theme/`.
- Bifrost mounted as a submodule at `themes/bifrost/` for shared tokens.
- Cloudflare Pages deploys from `main`.

## Common Commands

```sh
mise install
mise run serve
mise run build
mise run check
```

The dev server chooses the first free port starting near 1112.

## Documentation Rules

- This repo is the first place to look for canonical answers about content
  conventions, component usage, pipeline operations, and architecture.
- Keep component docs in sync with reusable Bifrost changes made in
  `../www.wheelofheaven.world/themes/bifrost/` or `../bifrost/`.
- Every page should set explicit frontmatter and usually
  `template = "page.html"`.
- New top-level sections require:
  - `content/<section>/_index.md`
  - a sidebar entry in `themes/docs-theme/templates/partials/sidebar.html`
  - a section color in `themes/docs-theme/sass/abstracts/_section-colors.scss`

## Zola Shortcode Escaping

Zola processes shortcodes inside inline code and fenced code blocks. Literal
shortcode examples must be escaped:

```markdown
{%/* definition(term="Elohim") */%}
body text
{%/* end */%}

{{/* cite(id="1", text="[1]") */}}
```

Use this rule whenever documenting shortcode syntax.
