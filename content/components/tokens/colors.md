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

## Theme accents

The accent is **ink on the rainbow**, in both themes.

`--color-accent-primary` is the text ink: `$gray-100` in the dark theme and
`$gray-900` in the light one. Until 2026-11 it was a hue (`$mint` on dark,
`$mauve-700` on light); it no longer is, so nothing on the site reads as
"the cyan" or "the purple". `--color-focus` and the `--color-badge-bg` /
`--color-badge-text` pair follow the ink.

What marks an accent is `--accent-rainbow`, a `linear-gradient` of the
seven palette hues (pink, lavender, mauve, blue, cyan, mint, green). It
uses the 300 band on dark and the 500 band on light, because the pastel
band nearly vanishes as a 1–2px line on white. A gradient cannot be a
`color`, so the rainbow is drawn wherever a **line** can carry it:

| Use | How | Mixin |
|---|---|---|
| A link in running text | ink text, rainbow underline as a `background-image` | `grammar-rainbow-link` |
| A rule on one edge of a box | `border-image` | `grammar-rainbow-rule` |
| A ring on a rounded pill | band on `border-box` under a transparent border, fill on `padding-box` | (see `.aid-rows__tag--accent`) |
| A wash on a button | translucent stops, ring at full strength | (see `.navbar__cta-split`) |

Both mixins live in `sass/pages/_grammar.scss`. Prose links in every
reading column (`a:not([class])`, `.wikilink`, `.glossary-term`,
`.libref` inside `p`, `li`, `td`, `dd`, `blockquote`, `figcaption`) take
`grammar-rainbow-link`; reference markers, pills, buttons and cards keep
their own treatment.

`--accent-rainbow-wash` is the same band made translucent (30% on dark,
26% on light), for fills: the Start-here item, the install prompt, the
notification call-to-action, the glossary tooltip label and the category
rail use it under a full-strength `--accent-rainbow` ring.

Two consequences to keep in mind when writing styles:

- **A state that only changes `color` to the accent is now invisible**,
  because the accent equals the text colour. Give hover, active and
  current states a second cue: an underline, a border, a background, or
  the rainbow rule. The 23 older titles and links that had no second cue
  are collected in `sass/components/_accent-states.scss`, where they take
  a hairline underline; new hover states carry their own cue and are not
  added to that list.
- **`--color-link` is an alias of the accent**, so it is the text ink.
  Until 2026-11 no theme defined it and the page rules that asked for it
  silently inherited the text colour. Colour alone does not mark a link:
  use `grammar-rainbow-link`.

Claim-label colours (direct, framework, inferred, speculative) are
semantic, not accents, and are unchanged; see
[claim-badge](../../chrome/claim-badge/). The same holds for the mint
dispatch and article chips, which mark a content type and are mint so as
to stay distinct from the claim labels, and for the translation badges,
whose colours mark the review tier.

Over the landing page's video heroes the chrome borrows dark-theme
tokens, and the accent there steps up to `$mauve-300` so it stays
visible on the footage (see `pages/_home.scss`).

## Secondary text on the light theme

`--color-text-muted` and `--color-text-subtle` carry dates, counts,
labels and small print.
On the light theme they were `$gray-600` and `$gray-500`, which measured
3.95:1 on the tinted surfaces and 2.07:1 on white, against the 4.5:1
minimum for body-size text.
They are now two steps from `$gray-600` towards `$gray-700`
(`color.mix`, 30% and 10%): muted passes on white, `$gray-100` and
`$gray-200`; subtle passes on white and `$gray-100`.
Do not put subtle text on `$gray-200` or darker surfaces, and do not
lower either token's contrast further with `opacity`: two places that did
(the reader's phone paragraph numbers, the footer's small print) fell
below 2:1.

The dark theme's pair (`$gray-400`, `$gray-500` on `$gray-950`) passes
as it is.

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
