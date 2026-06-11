+++
title = "Narrative map (/map/)"
description = "The interactive Wheel of Heaven map — precessional ellipse, constellations, day boxes, Earth half-arc, hover highlighting, poster-mode toggle, full i18n."
template = "page.html"
weight = 90
+++

The `/map/` page is a single full-canvas SVG that restages the original
Inkscape narrative-map poster as a navigable, link-bearing surface.
Every node is an `<a>`, every age segment lights up on hover, and a
poster-mode toggle flips the whole composition between the photographic
Bifrost rendering and a monochrome line-work view close to the
print original.

**Source:**
- Template: [`themes/bifrost/templates/map.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/map.html)
- Styles: [`themes/bifrost/sass/pages/_map.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/pages/_map.scss)
- Constellations partial: [`themes/bifrost/templates/partials/map/constellations.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/map/constellations.html)
- Icons partial: [`themes/bifrost/templates/partials/map/icons.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/map/icons.html)
- Behavior: [`www.wheelofheaven.world/static/js/map-native.js`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/static/js/map-native.js)
- Source poster (text intact, Inkscape-editable): [`www.wheelofheaven.world/assets/map/narrative-map.svg`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/assets/map/narrative-map.svg)

## Composition

The canvas viewBox is `0 0 1668 2388` — the exact dimensions of the
Inkscape source. All coordinates in the data files are read directly
from the poster, which means new entries can be placed by reading
the source SVG with an Inkscape coordinate readout.

The wheel itself derives from the `zodiac` ellipse in the source
(`cx=485.05 cy=1200.15 rx=662.36 ry=428.28`), transformed by
`matrix(0.84647832, -0.5324232, 0.35281197, 0.93569424)` —
center `(834, 864.7)`, semi-axes `671.35 × 414.05`, rotation `140.39°`.
Age boundaries are parameter angles `t°` on that ellipse, and the
arc segments + age-name `<textPath>`s are computed analytically from
the angles so translations self-center along the rim.

The Earth hemisphere is the circle `(834, 2174.6)` `r 699.59` — its
equator sits exactly on the canvas frame bottom.

## Data files

The page is driven by five JSON files under
[`www/data/map/`](https://github.com/wheelofheaven/www.wheelofheaven.world/tree/main/data/map):

| File | What |
|------|------|
| `ages.json` | The 12 zodiac segments — id, color, date range, segment path, label arc, midpoint, optional day box. |
| `nodes.json` | Page-backed entries around the wheel. Title auto-translates via `get_page` — the wiki/timeline/library page must exist in **all 9 languages** or the build fails. Use `label_key` to override with an i18n string for entries whose label differs from the page title. |
| `earth-nodes.json` | Entries placed inside the Earth half-arc, grouped into clusters. Each entry lists the `ages` it relates to so hovering it draws connector arcs. Labels come from `i18n.earthNodes`. |
| `notes.json` | Decorative annotations from the poster ("Public outrage", "As Above So Below", "Renouveller les actes…"). Text is routed through `i18n.notes`; multiline labels use `\n` and render as `<tspan>` lines. |
| `i18n.json` | All translatable strings for the page — keyed by language, then `ages`, `days`, `nodeLabels`, `earthNodes`, `notes`, plus single keys like `posterToggle`, `goldenAge`, `today`. |

## Visual classes

| Class | What |
|-------|------|
| `.map-page` | Page wrapper. Sets the `--map-bg` / `--map-line` / `--map-text` palette (pure `#000` dark, pure `#fff` light) and the `--map-zoom` variable read by the canvas. |
| `.map-page.is-poster` | Toggled by the poster button. Hides the Earth photo and atmosphere glow, drops all color accents to `--map-text`, and thickens the age segments — emulating the print poster. |
| `.map-canvas` | The single SVG. `aspect-ratio: 1668 / 2388`. Sized by `var(--map-zoom)`. |
| `.map-canvas__bg` / `.map-canvas__frame` | Background rect + the dashed inner frame from the original poster. |
| `.map-rim` | The faint dashed zodiac ellipse. |
| `.map-age` / `.map-age-label` / `.map-age-stamp` | One age segment, its `<textPath>` name, and the rotated BCE/CE date stamp at its boundary. |
| `.map-const` | One constellation figure. Carries `data-map-age="age-of-…"` so it lights with the active age. |
| `.map-day` / `.map-genesis-box` | Numbered "1st Day"–"7th Day" rim boxes + the "Beginning of GENESIS / בְּרֵאשִׁית" box. Fills with `var(--map-bg)` so they mask the rim cleanly. |
| `.map-core` | The small central precession ellipse with the "Precession of the Equinoxes" label. |
| `.map-earth` / `.map-earth-cluster` / `.map-earth-node` | The Earth half-arc, the clusters inside it (disclosure / transmission / modernity), and each entry's `<a>`. Cluster + node modifiers `--mint --mauve --yellow --cyan` set the accent color. |
| `.map-earth-connectors` | The dashed connector paths drawn into the SVG at runtime when the reader hovers an Earth node. |
| `.map-node` | A wheel entry's `<a>`. Modifiers `--source --timeline` set the type accent; `--priority-1 / 2 / 3` set the relative font size. |
| `.map-strip__word` | The DISTORTION → DEIFICATION → … → VIOLENCE row across the bottom of the Earth. |
| `.map-zoom-controls` / `__button` | The floating button cluster top-right (poster, zoom-out, zoom-in). |

## Interactive behavior

[`map-native.js`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/static/js/map-native.js)
wires up the controls. The script attaches to `[data-map-root]` and
exits silently if the element is absent — the page degrades to a
read-only SVG without JS.

| Affordance | What |
|------------|------|
| Hover / focus an age | Activates the segment, the matching constellation, and the matching date stamp. Lights all related wheel nodes via `.is-related`. |
| Hover / focus a wheel node | Activates its age and selects the node. |
| Hover / focus an Earth node | Selects the node, lights the related ages, and draws dashed connector paths from the node up to each related age midpoint. |
| Zoom buttons | Step through `[0.75, 1, 1.25, 1.5, 1.75, 2]` via `--map-zoom`, recentring on the previous viewport center. |
| Poster button | Toggles `.is-poster` on `.map-page`, persisted in `localStorage.mapPosterMode`. |
| URL hash | `/map/#great-flood`, `/map/#age-of-aries`, `/map/#bible` etc. selects the matching entry on load and scrolls it into view. Listens to `hashchange`. |

## Poster mode

The poster button (top-right of the control group, image icon) flips
`.map-page.is-poster`. In that mode:

- The Earth's photo, atmospheric glow, and shade go to `display: none`.
- All age, node, and Earth-node accents collapse to `var(--map-text)`.
- Age segments thicken from `2.5px` to `5px` when active.
- Connector paths use `var(--map-line)` instead of the cyan dash.

The result in **light theme** is black-on-white line work; in
**dark theme**, white-on-black. The button toggles, persists in
`localStorage`, and shadows the visual register of the original
print poster while keeping the live links and hover highlighting.

## i18n

The label for the poster button itself is `i18n.posterToggle` — keyed
in all 10 supported language codes (`en de fr es ru ja zh zh-Hant ko he`)
in [`data/map/i18n.json`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/data/map/i18n.json).

`map.html` is RTL-aware via the global `dir="rtl"` set by base.html;
the SVG itself uses no flowed text, so labels positioned with
`text-anchor` render correctly in Hebrew.

## Adding a new entry

1. **Pick a slug.** For wheel entries it must exist as a wiki, timeline, or
   library page **in all 9 site languages** — `get_page` is used to
   resolve titles, and a missing translation breaks the build. Earth
   entries are looked up via `i18n.earthNodes[<id>]` instead and don't
   have the all-languages requirement, but you must add the key in all
   10 languages.
2. **Position it.** Open `assets/map/narrative-map.svg` in Inkscape,
   note the X/Y of the position you want. (The viewBox is the same as
   the canvas, so coordinates copy 1:1.)
3. **Add the JSON entry** to the relevant file:
   - `nodes.json` for wheel entries — `id`, `href`, `age`, `x`, `y`,
     `priority` (1–3), `anchor`, optional `summary`, optional
     `label_key`.
   - `earth-nodes.json` for Earth entries — same shape, plus the
     `ages` array that controls connector targets and an optional
     `emphasis` (`strong` / `quiet` / `caps`).
4. **Add i18n keys** under `nodeLabels` (wheel, optional) or
   `earthNodes` (Earth, required) in all 10 languages.
5. **Verify.** `zola serve` does **not** watch `data/`, so after
   editing the JSON files either touch a template or restart the
   server. Then check both themes and at least one RTL language (`he`)
   and one CJK language (`ja` or `zh`) to confirm wrapping behaves.

## Regenerating the print artifact

The Inkscape source at `assets/map/narrative-map.svg` keeps text intact
for editability; the served file at `static/map/narrative-map.svg`
has all text converted to outlined paths so the print map renders
identically without the project's licensed fonts. Run
`scripts/build-map.sh` from inside `www.wheelofheaven.world/` after
editing the source — it shells out to Inkscape's
`--export-text-to-path --export-plain-svg`.

## Live examples

- The page itself: [/map/](https://www.wheelofheaven.world/map/)
- Direct entry highlight via hash:
  [/map/#great-flood](https://www.wheelofheaven.world/map/#great-flood),
  [/map/#age-of-aries](https://www.wheelofheaven.world/map/#age-of-aries)
- A non-English render to see translated rim labels:
  [/de/map/](https://www.wheelofheaven.world/de/map/),
  [/he/map/](https://www.wheelofheaven.world/he/map/)
