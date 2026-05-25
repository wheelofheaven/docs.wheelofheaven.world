+++
title = "Bifrost components"
description = "The Wheel of Heaven theme — design tokens, SCSS components, Tera macros, and content shortcodes that compose the visual language across www.wheelofheaven.world."
sort_by = "weight"
weight = 35

[extra]
summary = "Reference for Bifrost: the Zola theme behind www.wheelofheaven.world. Documents every reusable SCSS component, Tera macro, and content shortcode, with code snippets and links to canonical call sites."
+++

Bifrost is the theme that powers [www.wheelofheaven.world](https://www.wheelofheaven.world).
Its source lives at [`wheelofheaven/bifrost`](https://github.com/wheelofheaven/bifrost),
mounted as a submodule under `themes/bifrost/` in both the main site repo and
this docs repo.

This section documents Bifrost from the outside-in:

- **[Visual language](visual-language/)** — the premium-CTA recipe (glass +
  drifting cloud-duo gradient) and its two adoption mixins.
- **[Chrome](chrome/)** — page-structural UI: breadcrumbs, claim badges,
  dispatch chips, section marks, translation indicators, figures.
- **[Interactive](interactive/)** — JS-backed widgets: glossary tooltips,
  reader controls, sharing, keyboard shortcuts, modals, snackbars.
- **[Content components](content/)** — pieces used inside article bodies:
  cards, buttons, wiki-shortcode visuals, related-content blocks.
- **[Tera macros](macros/)** — server-side render helpers imported into
  templates with `import` and called as `namespace::name(args)`.
- **[Content shortcodes](shortcodes/)** — Tera shortcodes invoked from
  markdown with paired-tag (body) or inline-tag (no body) syntax.
- **[Tokens](tokens/)** — the SCSS abstracts (colors, spacing, type,
  mixins, functions) that everything above composes from.

## How to read these pages

Every component page follows the same shape:

1. **What it is** — one paragraph.
2. **Anatomy** — what the recipe does and why.
3. **Usage** — `@use` / `@include` / `import` snippets you can paste.
4. **Tokens** — what to override per instance (CSS custom properties,
   macro params, etc.).
5. **Live examples** — links to canonical call sites on
   `www.wheelofheaven.world` where the component renders.
6. **Related** — companion components.

Pages do **not** render components live inside the docs site — the docs
theme has its own CSS-variable contract that doesn't fully align with
Bifrost's, so embedded examples would drift visually from the real site.
Instead, every page links to a live URL where you can inspect the
component in its real context with DevTools.

## When to add a new component

Before adding a new component to Bifrost, check whether an existing one
fits. Specifically: any new lead-card or premium-CTA surface should
adopt [`glass-cloud-card`](visual-language/glass-cloud-card/) or
[`glass-cloud-button`](visual-language/glass-cloud-button/) rather than
inventing a fresh background treatment. Re-use is the point of the
component library — when in doubt, link to this docs section from your
PR and ask which existing component to extend.
