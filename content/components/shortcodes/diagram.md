+++
title = "diagram"
description = "Inline, theme-aware SVG figure that localizes to the page language. Inline tag, takes name / caption / alt."
template = "page.html"
weight = 65
+++

The `diagram` shortcode inlines a hand-authored SVG figure and localizes
it to the page's language. Unlike [`figure`](../figure/) (which embeds a
raster from the CDN), `diagram` inlines the SVG into the DOM so it
inherits the theme's CSS custom properties and **recolours on the
light/dark toggle** with no second asset.

**Source:**
[`themes/bifrost/templates/shortcodes/diagram.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/diagram.html)
&middot; component styles:
[`sass/components/_diagram.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_diagram.scss)
&middot; generator:
[`tools/gen_diagrams.py`](https://github.com/wheelofheaven/bifrost/blob/main/tools/gen_diagrams.py)

## Syntax

```markdown
{{/* diagram(
    name="precession",
    alt="Earth's tilted axis sweeps a cone; the pole traces a circle past Thuban, Polaris, Vega.",
    caption="Axial precession — one **Great Year** (≈ 25,772 years)."
) */}}
```

| Param     | Type   | Required | Default | What                                                       |
|-----------|--------|----------|---------|------------------------------------------------------------|
| `name`    | string | yes      | —       | Diagram id (matches `static/diagrams/{name}.svg`).         |
| `alt`     | string | recommended | —    | Accessible label for the figure group.                     |
| `caption` | string | no       | `""`    | Caption below the figure; rendered as inline markdown.     |
| `hero`    | bool   | no       | `false` | Set the figure as the page's lead image (see below).       |

## Hero diagrams

`hero=true` makes the figure the page's defining image: a larger plate
with a soft prism glow, and on phones it bleeds to the screen edge. Put
a hero diagram first in the page body, directly under the header. Since
2026-11 three wiki entries open this way, in every language:
`great-year` on *Great Year*, `precession` on *Precession* and
`wheel-of-heaven` on *Wheel of Heaven*. Use it only where the figure is
the clearest statement of the entry; every other diagram stays inline.

```markdown
{{/* diagram(name="great-year", hero=true, alt="…", caption="…") */}}
```

## Available diagrams

| `name`                 | What                                                        |
|------------------------|------------------------------------------------------------|
| `precession`           | Axial-precession cone (Thuban → Polaris → Vega).            |
| `great-year`           | The ~25,772-yr cycle as a wheel of twelve zodiac Ages.      |
| `wheel-of-heaven`      | The twelve precessional ages as phases of the project.     |
| `world-ages-timeline`  | The precessional-age framework as a horizontal timeline; ships a vertical phone variant. |

## Localization

The shortcode detects the page language from its path (the same pattern
as [`library`](../library/) / [`wiki`](../wiki/)) and loads
`static/diagrams/{name}.{lang}.svg`, falling back to the bare
`{name}.svg` (English) when a localized variant is absent. Every diagram
ships in all nine site languages plus English (50 SVGs total, phone variant included; the unused `epistemic-tiers` pyramid was retired 2026-11-08 because its tiers no longer matched the four claim labels).

The SVGs are **generated, not hand-edited per language**. Text lives in
per-language string tables at
[`tools/diagram-strings/{lang}.json`](https://github.com/wheelofheaven/bifrost/blob/main/tools/diagram-strings/);
`tools/gen_diagrams.py` renders every `{name}.{lang}.svg` from them:

```sh
# from the www.wheelofheaven.world working copy
python themes/bifrost/tools/gen_diagrams.py
```

To change a label, edit the relevant `diagram-strings/*.json` and
re-run the generator. To add a language, add a `{lang}.json` (copy
`en.json`, translate the values) and re-run.

## Visual language

All diagrams are one family (redesigned 2026-11):

- **The ages carry the Bifrost rainbow.** The twelve precessional ages
  take the reading grammar's pastel band in chronological order —
  `--dg-age-0` (Capricorn, the project's opening) through `--dg-age-11`
  (Aquarius, the present) — so an age has the same hue in every figure.
  The band wraps pink → pink, closing around a wheel without a seam.
  Dark theme uses the 300 pastels, light theme the 600 shades.
- **One accent marks the present.** The theme accent (mint in dark,
  mauve in light) is reserved for "now": the current age, the
  Pisces|Aquarius marker, Polaris.
- **Sibling wheels.** `great-year` and `wheel-of-heaven` share one
  geometry in the generator: rainbow rim, tinted sectors, glyph + name
  (+ gloss) stacked in each sector, the direction of the ages inside the
  hub, rim years outside.
- **Horizontal labels, no collisions**, and the grammar's one mono voice
  for dates and figure notes.
- **A plate, not a box**: a soft radial glow behind the figure, no
  border. Round figures keep a fixed size instead of stretching to the
  column.

## Phone variants

A wide figure can ship `static/diagrams/{name}-narrow.{lang}.svg`. The
shortcode inlines both and a media query shows the narrow one below
640px. `world-ages-timeline` uses this: twelve horizontal cells on
desktop, a vertical list with each age's dates on phones.

## RTL pages

`:lang(he)` sets `direction: rtl` on every element, which would flip
every SVG `text-anchor`. `_diagram.scss` pins the SVG and its text to
`ltr`; Hebrew words inside a label still run right-to-left through the
bidi algorithm.

## Theming

Every stroke and fill inside the SVGs is a class resolved in
`_diagram.scss`, so one SVG serves both themes: `.dg-age-{0–11}`
(+ `.dg-age--now`) tint sectors and cells, `.dg-rim-*` / `.dg-bar-*` /
`.dg-ink-*` carry the age hue on rims, bars and glyphs; `.dg-hair`,
`.dg-muted-line`, `.dg-accent-line`, `.dg-axis-line` are strokes;
`.dg-now` / `.dg-now-halo` the present marker; `.dg-label`,
`.dg-label--muted`, `.dg-label--now`, `.dg-title` the text; `.dg-mono`
the monospace notes; `.dg-glyph` the zodiac glyphs reused from the
[`zodiac`](../../macros/zodiac/) macro.

Don't give `.diagram__plate` a `position`: the reading pages' prism
wash is a positioned overlay, and a positioned plate paints above it as
a dark slab.

## Output

```html
<figure class="diagram diagram--great-year diagram--hero" role="group" aria-label="…">
    <div class="diagram__plate">
        <div class="diagram__canvas"><svg>…</svg></div>
        <!-- with a phone variant: diagram--has-narrow, plus
             <div class="diagram__canvas diagram__canvas--narrow">…</div> -->
    </div>
    <figcaption class="diagram__caption">…</figcaption>
</figure>
```

## Related

- [Shortcodes → figure](../figure/) — the raster (CDN image) analog.
- [Macros → zodiac](../../macros/zodiac/) — the glyph set the timeline reuses.
