+++
title = "Tokens"
description = "The SCSS abstracts that everything else in Bifrost composes from — colors, spacing, type, mixins, functions."
sort_by = "weight"
weight = 5

[extra]
summary = "The design-token layer. Every other Bifrost SCSS file `@use`s these abstracts — change a token here and the change propagates through every component automatically."
+++

The token layer is the foundation. Every Bifrost component reaches up
to `sass/abstracts/` for its colours, spacing, radii, transitions, type
scales, mixins, and helpers. Components never hardcode colours or pixel
values — they reference tokens.

| Module    | File                          | Contains                                          |
|-----------|-------------------------------|---------------------------------------------------|
| Colors    | `_colors.scss`                | Palette: yellow, pink, lavender, mauve, blue, cyan, teal, mint, green — each in shades 100–900. |
| Variables | `_variables.scss`             | Spacing scale, border-radius scale, transitions, z-indices, font sizes, breakpoints, viewport. |
| Mixins    | `_mixins.scss`                | Reusable mixin set — visually-hidden, focus rings, glass surfaces, layout helpers. |
| Functions | `_functions.scss`             | SCSS helper functions — `rem()`, `color-mix()` wrappers, palette accessors. |

The docs theme [imports the Bifrost abstracts directly][forward] via
`@forward` so the two sites stay in visual lockstep — change a Bifrost
token, redeploy docs, and the docs UI tracks the change automatically.

[forward]: https://github.com/wheelofheaven/docs.wheelofheaven.world/blob/main/themes/docs-theme/sass/abstracts/_tokens.scss
