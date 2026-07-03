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

## Available diagrams

| `name`                 | What                                                        |
|------------------------|------------------------------------------------------------|
| `precession`           | Axial-precession cone (Thuban → Polaris → Vega).            |
| `great-year`           | The ~25,772-yr cycle as a wheel of twelve zodiac Ages.      |
| `wheel-of-heaven`      | The twelve precessional ages as phases of the project.     |
| `epistemic-tiers`      | The four-tier content pyramid (direct → open questions).   |
| `world-ages-timeline`  | The precessional-age framework as a horizontal timeline.   |

## Localization

The shortcode detects the page language from its path (the same pattern
as [`library`](../library/) / [`wiki`](../wiki/)) and loads
`static/diagrams/{name}.{lang}.svg`, falling back to the bare
`{name}.svg` (English) when a localized variant is absent. Every diagram
ships in all nine site languages plus English (50 SVGs total).

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

## Theming

Diagram internals use theme-aware helper classes so a single SVG works
on both themes: `.dg-line` / `.dg-muted` (strokes → text colours),
`.dg-accent` / `.dg-accent--fill` (the through-line, in the theme
accent), `.dg-surface` (fills), `.dg-label` / `.dg-label--muted` /
`.dg-label--accent` (text), `.dg-glyph` (zodiac glyphs, reused from the
[`zodiac`](../../macros/zodiac/) macro), and `.dg-axis` (monospace
technical captions). See `_diagram.scss`.

## Output

```html
<figure class="diagram" role="group" aria-label="…">
    <div class="diagram__canvas"><svg>…</svg></div>
    <figcaption class="diagram__caption">…</figcaption>
</figure>
```

## Related

- [Shortcodes → figure](../figure/) — the raster (CDN image) analog.
- [Macros → zodiac](../../macros/zodiac/) — the glyph set the timeline reuses.
