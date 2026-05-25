+++
title = "Colors"
description = "The Bifrost palette — nine hues (yellow, pink, soft-pink, lavender, mauve, blue, cyan, teal, mint, green) each in shades 100–900, plus neutrals."
template = "page.html"
weight = 10
+++

The Bifrost colour palette is the visual identity of the site. Nine hues
plus a soft-pink alternate, each in nine shades (100 = lightest, 900 =
darkest), plus a neutral gray ramp and pure black/white.

**Source:**
[`themes/bifrost/sass/abstracts/_colors.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/abstracts/_colors.scss)
&middot;
[full palette on Coolors][coolors]

[coolors]: https://coolors.co/fbf8cc-fde4cf-ffcfd2-f1c0e8-cfbaf0-a3c4f3-90dbf4-8eecf5-98f5e1-b9fbc0

## Hues

| Hue            | Base shade (300) | Used for                                                                  |
|----------------|------------------|---------------------------------------------------------------------------|
| `yellow`       | `#fbf8cc`        | Inferred claim badges, warning indicators.                                |
| `pink`         | `#fde4cf`        | Contributing-content section accent.                                      |
| `soft-pink`    | `#ffcfd2`        | (Alternate; less used.)                                                   |
| `lavender`     | `#f1c0e8`        | Speculative claim badges, components section accent (in docs).            |
| `mauve`        | `#cfbaf0`        | Framework claim badges, contributing-dev accent, "history" cloud-duo.      |
| `blue`         | `#a3c4f3`        | Architecture accent, "history" + "edit" cloud-duos.                       |
| `cyan`         | `#8eecf5`        | Direct claim badges, getting-started accent, library "Read in" cloud-duo. |
| `teal`         | (similar to cyan)| (Less used.)                                                              |
| `mint`         | `#98f5e1`        | Reference accent, dispatch chip, "human translation" badge, "edit" duo.   |
| `green`        | `#b9fbc0`        | (Reserved; not currently bound.)                                          |

## Shade scale

Every hue exposes shades `100` (lightest) through `900` (darkest) in 100
steps. The `300` shade is the **canonical** value — it's what
`glass-cloud-card`'s `--cloud-a` / `--cloud-b` overrides expect, and it's
what most chip backgrounds and accent assignments use.

```scss
$mauve-100: #ece2fa;
$mauve-200: #ddcdf5;
$mauve-300: #cfbaf0;   // ← canonical "mauve"
$mauve-400: #b89be4;
…
$mauve-900: #2c1c4c;
```

## Neutrals

Standard gray ramp:

| Token         | Value     |
|---------------|-----------|
| `$white`      | `#fff`    |
| `$gray-100`   | `#f8f9fa` |
| `$gray-200`   | `#e9ecef` |
| `$gray-300`   | `#dee2e6` |
| `$gray-400`   | `#ced4da` |
| `$gray-500`   | `#adb5bd` |
| `$gray-600`   | `#6c757d` |
| `$gray-700`   | `#495057` |
| `$gray-800`   | `#343a40` |
| `$gray-900`   | `#212529` |
| `$gray-950`   | `#1b1f22` |
| `$black`      | `#000`    |

## How to pick a hue

Bifrost uses colour assignment by **role**, not by aesthetic preference.
When you reach for a new hue, first check whether the role you're
filling already has one:

- **Claim-type badge** → see the [claim-badge](../../chrome/claim-badge/) table.
- **Section accent** → see the docs-theme's
  [`_section-colors.scss`](https://github.com/wheelofheaven/docs.wheelofheaven.world/blob/main/themes/docs-theme/sass/abstracts/_section-colors.scss)
  for an example of role-binding done well.
- **`glass-cloud-card` / `glass-cloud-button` cloud-duo** →
  see [Visual language](../../visual-language/) for the curated pairings.
- **Translation status** → see the
  [translation indicators](../../chrome/translation-indicators/) table.

If your component needs a new colour role, add it to the relevant
mapping file first, then reference it via the role variable — not by
referencing the hue directly.

## Related

- [Visual language](../../visual-language/) — cloud-duo pairings.
- [Claim badge](../../chrome/claim-badge/) — the canonical claim-type colour bindings.
