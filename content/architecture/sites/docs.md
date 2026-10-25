+++
title = "docs.wheelofheaven.world"
description = "This documentation site — Zola with a custom docs-theme that borrows Bifrost's tokens, fonts and footer so it reads as part of the main site."
weight = 40
+++

The author, contributor and developer documentation. English-only, built
from this repository, hosted like the other sites on Cloudflare Pages.

## Overview

- **URL:** <https://docs.wheelofheaven.world>
- **Generator:** Zola 0.22.1
- **Hosting:** Cloudflare Pages (`main` branch, `zola build`)
- **Theme:** `docs-theme` (this repository, `themes/docs-theme/`), on top of a
  pinned Bifrost submodule
- **Languages:** English

## What it shares with the reading site

The docs are meant to feel like one more section of Wheel of Heaven, not a
separate product. Three things make that true, in order of how much they carry:

| Shared | How | Where |
| --- | --- | --- |
| **Design tokens** | `abstracts/_tokens.scss` `@forward`s Bifrost's `colors`, `variables`, `functions` and `mixins` from the submodule. Palette, spacing, radii and transitions are therefore Bifrost's. | `themes/docs-theme/sass/abstracts/_tokens.scss` |
| **Theme values** | `base/_theme-vars.scss` sets the light and dark custom properties to the values in Bifrost's `themes/_light.scss` and `_dark.scss`: white / `gray-950` page, `gray-600` / `gray-400` muted text, `gray-300` / `gray-800` hairlines, mauve / mint accents, `gray-100` / `gray-950` footer. Two vocabularies coexist on purpose: the docs theme's own names (`--color-bg`, `--color-surface`, `--color-border`, `--color-accent`) keep every docs component working, and the Bifrost names (`--color-hairline`, `--color-footer-bg`, `--color-hover`, `--color-focus`, `--color-accent-primary`, `--color-text-subtle`, `--font-family-lead`, …) let Bifrost stylesheets be ported verbatim. | `themes/docs-theme/sass/base/_theme-vars.scss` |
| **Fonts** | Firmament Sans 0.1 for body text (the same four WOFF2 files the main site serves, vendored with checksums), Space Grotesk for display, iA Writer Quattro for code. | `themes/docs-theme/static/fonts/vendor/`, `sass/base/_fonts.scss` |
| **Footer** | Bifrost's `partials/footer.html` and `sass/layout/_footer.scss`, verbatim in structure, classes and content. | `themes/docs-theme/templates/partials/footer.html`, `sass/layout/_footer.scss`, `sass/components/_footer-prefs.scss` |
| **Theme toggle** | The same icon control (moon while dark, sun while light), in the footer only; the docs navbar carries none. | `static/js/theme-toggle.js` |
| **Brand** | Logomark, wordmark and social marks are copies of Bifrost's partials. | `templates/partials/brand/`, `templates/partials/social/` |

What stays docs-scoped, deliberately: the navbar (brand with the “Docs”
suffix and search only: no section links, no theme toggle), the sidebar navigation,
the table of contents, and the section accent colours on headings.

### The footer, and three decisions behind it

The footer is the reading site's footer, down to the elevator pitch and
the rounded panel corners. Three adaptations, each because the docs have
no equivalent of what the main site's footer assumes:

1. **Every link points at the reading site** (`config.extra.upstream_site`),
   since the docs have no `/wiki/`, `/press/` or `/privacy-policy/`.
   “Documentation” under Development links here, exactly as it does on
   the main site.
2. **Strings are inlined in English.** The docs site has no `[translations]`
   table; Bifrost's footer reads 42 keys through `trans()`. When the main
   site's wording changes, change it here too.
3. **The language menu opens the reading site.** The control is identical,
   but choosing Deutsch goes to `www.wheelofheaven.world/de/` rather than
   switching this site, because there is nothing to switch to. The trigger's
   `title` says so; `static/js/footer-prefs.js` does the redirect.

Unlike Bifrost, which hides the preference controls (language and theme)
below 1000 px because its burger menu repeats them, the docs footer keeps
them at every width: the docs navbar has no menu to carry them.

## Keeping it in step

The Bifrost pin is manual and drifts freely from the main site's; the
four `@forward`s in `_tokens.scss` are the whole surface the docs consume,
so a bump is safe when those four files still compile. Advance it with
`git -C themes/bifrost checkout <sha>` and commit the pointer.

When Bifrost's footer changes, diff `partials/footer.html` and
`sass/layout/_footer.scss` against this theme's copies; the only intended
differences are the three above and the namespace mapping noted at the
top of `_footer.scss` (`vars.` / `colors.` → `t.`, `$font-size-sd` →
`$font-size-base`, `$font-weight-lg` → `700`).

## Build and check

```sh
mise run build     # zola build
mise run check     # zola check
mise run serve     # dev server with live reload
```

Verify visual changes against the dev server, not a static build served
from another origin: a static build embeds the absolute `base_url`, so a
page opened from `public/` loads the production stylesheet and your
change appears to do nothing.

## See also

- [Firmament Sans and scholarly typography](@/components/tokens/typography.md)
  — the fonts, the Hebrew companion and where Firmament is adopted
- [Bifrost Theme](@/contributing/dev/bifrost-theme.md) — the reading site's
  theme this one borrows from
- [Hosting and Caching](@/architecture/hosting-and-caching.md)
