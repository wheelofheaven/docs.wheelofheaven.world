+++
title = "Graph view (/map/?view=graph)"
description = "The second mode of /map/ — the whole content graph as a force-laid constellation, clustered by detected community, with legend filters and ego highlighting."
template = "page.html"
weight = 95
+++

`/map/?view=graph` is the second mode of the map page. Where the
[narrative map](../narrative-map/) restages the Inkscape poster, the
graph view renders the **entire content graph** — every wiki entry,
article, timeline chapter and dispatch — as a force-laid constellation.

It reads the same CC0 dataset the API serves, so the picture and the
machine-readable graph can never disagree.

**Source:**
- Markup: [`themes/bifrost/templates/map.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/map.html) (the `.map-graph` block)
- Styles: [`themes/bifrost/sass/pages/_map-graph.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/pages/_map-graph.scss)
- Behaviour: [`themes/bifrost/static/js/map-graph.js`](https://github.com/wheelofheaven/bifrost/blob/main/static/js/map-graph.js)
- Mode switching: `static/js/map-native.js`, which dispatches `map:modechange` and `map:zoom`

## Data

Fetched at runtime from
[`/v1/graph/content-graph.json`](https://api.wheelofheaven.world/v1/graph/content-graph.json)
— regenerated on api deploys, never at www build time. Roughly 193 nodes
and 1,817 edges.

The fetch is cross-origin, so `https://api.wheelofheaven.world` must stay in
the www `connect-src` directive in `static/_headers`. `zola serve` does not
apply that file, so a missing host only shows in production, as the page's
own error state plus a console `Refused to connect` message (this is how
the view was dark until 2026-09-16).

Nodes carry `section`, `claim_type`, `category` and `degree`. Edges are
typed: `see_also` (curated relatedness) or `in_body` (prose cross-link).

Node **fill** encodes section, the **stroke ring** encodes claim type,
and **radius** encodes degree.

## Clustering

Position encodes *community*. Without that the layout is repulsion plus
springs plus centering, which relaxes 193 nodes at mean degree ~15 into
an even hairball where position means nothing.

The view runs **one local-moving pass of Louvain modularity** at
resolution 1.4, then lays the communities out as lobes. The result is
topical: one lobe is Eden / Great Flood / Lucifer / Serpent /
Antediluvian, another Precession / Hamlet's Mill / Zodiac / World Age,
another Raël / Raëlism / Embassy / Message from the Designers.

Two things are worth knowing before touching this:

- **Label propagation does not work on this graph.** It was tried first
  and collapses: `wiki/elohim` alone touches 102 of the 193 nodes, so a
  single label floods the corpus — 190 of 193 in one community.
  Modularity resists that, because joining an already-large community is
  penalised by that community's total degree.
- **Cohesion alone cannot open gaps.** Pulling nodes toward their
  community centroid tightens the blob but does not separate it, because
  plain repulsion is identical within and across communities. Three
  forces are needed: cohesion, community-aware spring rest lengths
  (an edge that leaves its community wants to be long), and centroid
  repulsion.

Clustering drives **position only**. Node colour still encodes section,
so the legend and its filters are unaffected.

The whole layout is deterministic — seeded by `fnv1a` + `mulberry32` on
node ids, with tie-breaks on the lower community index — so the same
dataset always produces the same picture.

## Chrome

The floating surfaces follow the chrome/panel split described in
[`chrome-glass`](../../visual-language/chrome-glass/):

| Surface | Treatment |
|---|---|
| `.map-zoom-controls__button` | Chrome — dissolves, like the navbar |
| `.map-graph-legend` | Panel — keeps body via `--map-chrome-bg` |
| `.map-graph-card` | Panel |
| `.map-graph-footer` | Panel |
| `.map-graph__status` / `__retry` / `__skip` | Panel |

All of them align to `--map-chrome-gutter`, derived from the navbar's own
geometry (`width: 90%` capped at `max-width: 80rem`, centred → the gutter
is `max(5vw, (100vw - 80rem) / 2)`), so their outer edges track the
navbar's at every viewport.

The brandmark suffix ("Graph") is set in **Torchzilla**, the same face as
the poster's "Map", and ships as outline data because Torchzilla is a
local display face rather than a webfont. Regenerate with
`scripts/build_brand_suffix.py`.

## Interactive behaviour

| Affordance | What |
|------------|------|
| Click / focus a node | Ego highlighting — the node's own edges are drawn above the batched edge paths, neighbours stay lit, the rest of the canvas dims via `.is-dimmed`. |
| The node card | Shows the focused node's title and meta, top-left. `pointer-events: none` — it is a readout, not a target. |
| Legend filters | Each section swatch is a `<button>` toggling that section's nodes in and out. Counts update live. |
| Drag to pan | Pointer drag on the canvas. |
| Zoom buttons | Shared with the poster view. Labels appear for all nodes above `1.5` zoom; below it only the top 14 by degree are labelled. |
| Skip link | `.map-graph__skip` jumps past the canvas to the footer, for keyboard users. |

Edges are rendered as two batched `<path>` elements — one per edge type
— rather than 1,817 individual `<line>`s, with only the active node's
edges split out into their own group.

## Accessibility

The canvas itself is presentational; the legend is a real `<nav>` with
button filters, the status region is `role="status"`, and
`#map-graph-announce` is an `aria-live` region that announces filter
changes. The skip link is the escape hatch past the whole visualisation.

## Downloads

The footer offers the dataset directly: JSON, GraphML, and the
[dataset landing page](https://www.wheelofheaven.world/datasets/content-graph/).
This is the human end of the same artifact the API publishes.

## Live examples

- [/map/?view=graph](https://www.wheelofheaven.world/map/?view=graph)
- The scoped, per-entry version of the same graph: the
  [relatedness mini-graph](../../macros/relatedness-graph/) on any wiki
  entry, which links back here.

## Related

- [Narrative map](../narrative-map/) — the other mode of the same page.
- [`relatedness-graph`](../../macros/relatedness-graph/) — a scoped view
  of this graph, one entry at a time.
- [`chrome-glass`](../../visual-language/chrome-glass/) — the glass
  recipe its floating surfaces share.
- [`/v1/graph/`](https://api.wheelofheaven.world/v1/graph/) — the dataset.
