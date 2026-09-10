+++
title = "relatedness-graph"
description = "Scoped view of the content graph rendered above the See also list on wiki and article pages: the entry, its neighbours, and one ring of context. Single macro, precomputed geometry."
template = "page.html"
weight = 55
+++

`macros/relatedness-graph.html` renders a scoped view of the content
graph: the current entry at the centre, the entries it links to around
it, and one further ring of context — the neighbours' own neighbours,
drawn small and unlabelled — with the edges among them.

Reading the shape should tell you something. A dense mesh means a
tightly-bound cluster; a sparse fan means a bridging entry. Eden's eight
neighbours share 17 edges; Elohim's share 5, because its neighbours are
topically scattered.

It is a **visual companion** to the See also list — the list stays the
semantic / accessibility / crawl backbone, so the figure is `aria-hidden`
and its links are pulled from the tab order (`tabindex="-1"`) to avoid
duplicate screen-reader announcements. Real `<a href>` links are still
present for crawlers.

Part of the graph / relatedness surface (Decision 15, G3 — the human
counterpart to the API's [`/v1/graph/`](https://api.wheelofheaven.world/v1/graph/)
content graph).

**Source:**
[`themes/bifrost/templates/macros/relatedness-graph.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/relatedness-graph.html)
&middot; styled by
[`themes/bifrost/sass/components/_relatedness-graph.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_relatedness-graph.scss)
&middot; geometry from
[`www/scripts/build_relatedness_layout.py`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/scripts/build_relatedness_layout.py)

## Public API

```tera
{%/* import "macros/relatedness-graph.html" as relatedness_graph */%}

{{ relatedness_graph::neighborhood(
     title=page.title,
     see_also=page.extra.see_also,
     lang=detected_lang,
     page_path=page.path) }}
```

## Parameters

| Param       | Type   | Required | What                                                                        |
|-------------|--------|----------|-----------------------------------------------------------------------------|
| `title`     | string | yes      | Centre-node label — the current entry's title.                              |
| `see_also`  | array  | yes      | The page's `see_also` array (`{ title, path \| url, description }`). Used for the first ring's labels and links. |
| `lang`      | string | yes      | Language code; used to resolve each neighbour's `path` via `get_url`.       |
| `page_path` | string | yes      | The page's own `page.path`. Keys the layout lookup. Without it the macro renders nothing. |

The macro renders nothing when the page has no entry in
`data/relatedness.json` — an entry whose `see_also` targets all fall
outside the graph sections, for instance.

## Precomputed geometry

Positions come from a force simulation, and Tera has neither mutable
float loops nor trigonometry, so **the geometry is generated at build
time**, not in the template.

`scripts/build_relatedness_layout.py` (wired into `mise run build`)
derives the graph from content — curated `see_also` / `canon_links` plus
prose cross-links, mirroring the derivation in the api repo's
`prebuild.py` — and writes `data/relatedness.json`. What reaches the
macro is already drawable: line segments and points in viewBox
coordinates. The macro only loops and emits SVG.

```json
{
  "wiki/eden": {
    "c": [240, 170],                       // subject position
    "n": {"wiki/lucifer": [188, 132]},     // first ring, keyed by canonical id
    "s": [[96, 214]],                      // second-degree points
    "e": [[240, 170, 188, 132, 0]]         // x1 y1 x2 y2 kind
  }
}
```

Edge `kind` is `0` spoke, `1` chord, `2` outer.

Keys are canonical (`wiki/eden`), locale prefix stripped, so **all ten
locales share one layout**. They key on the page's *URL*, not its
filename — `wiki/council-of-eternals.md` publishes at
`/wiki/council-of-the-eternals/` via a frontmatter `slug`.

Regenerate after content changes:

```sh
mise run relatedness      # or: python3 scripts/build_relatedness_layout.py
```

## Anatomy

| Class                                   | What                                                        |
|-----------------------------------------|-------------------------------------------------------------|
| `.relatedness-graph`                    | Container, centred, max-width 520px. Holds the figure and the link. |
| `.relatedness-graph__figure`            | `<figure>` (`aria-hidden`) wrapping the SVG.                |
| `.relatedness-graph__svg`               | The `viewBox="0 0 480 340"` canvas.                         |
| `.relatedness-graph__edge--spoke`       | The entry's own links — the strongest line.                 |
| `.relatedness-graph__edge--chord`       | Links *among* its neighbours. Dashed. This is what stops the figure reading as a star. |
| `.relatedness-graph__edge--outer`       | The second-degree web. Near the threshold of visibility — texture, not content. |
| `.relatedness-graph__node`              | A first-ring neighbour `<a>` (a real link, `tabindex="-1"`). |
| `.relatedness-graph__dot`               | Node circle — fills `--color-background`, cyan ring.        |
| `.relatedness-graph__dot--center`       | The subject — filled cyan.                                  |
| `.relatedness-graph__dot--context`      | Second-degree node — small, unlabelled, unlinked.           |
| `.relatedness-graph__label`             | Node label. Carries a background-coloured stroke knockout so it stays legible where it crosses an edge. |
| `.relatedness-graph__full`              | Link out to the full graph. Sits **outside** the figure, which is `aria-hidden`. |

## Layout & behaviour

- **Bounded.** Up to 8 first-ring neighbours and 10 second-degree nodes.
  Second-degree nodes are ranked by how much of the first ring they
  touch, so the context shown is connective tissue rather than arbitrary
  leaves.
- **Subject anchored.** The simulation re-centres on the subject every
  step, and the fit scales each axis on a trimmed extent (88th
  percentile) with outliers clamped to the frame — so a lopsided
  neighbourhood cannot push the subject off to one side, and one distant
  node cannot shrink the readable core.
- **Radial bands.** Each ring is held at its own distance from the
  subject while its angle stays free. Without this a densely interlinked
  first ring collapses into a clump on one side.
- **Weight falls off with distance.** Spoke, chord and outer edges get
  three distinct opacities; the second-degree web registers as texture.
- **Theme-safe colours.** Edges and rings use a translucent cyan (not
  `--color-border`, which is near-transparent in dark); nodes fill with
  `--color-background`, so the figure reads in both light and dark.
- **Language-correct.** First-ring labels and links come from the page's
  own localised `see_also`; only the geometry is shared.

## Where it's wired

Called from `wiki-page.html` and `articles-page.html`, just under the
"See also" heading and above the `see_also` list.

Note that no `/articles/` or `/timeline/` entry currently sets
`see_also`, so in practice only wiki entries render a figure — 139 of
them at the time of writing.

## Live examples

Above the See also list on any wiki entry with `see_also`:
[/wiki/eden/](https://www.wheelofheaven.world/wiki/eden/) (dense),
[/wiki/elohim/](https://www.wheelofheaven.world/wiki/elohim/) (sparse).

## Related

- [Content → Related content](../../content/related-content/) — the "Read
  next" card block at the end of long-form bodies (a different relatedness
  surface).
- [`/v1/graph/`](https://api.wheelofheaven.world/v1/graph/) — the API's
  machine-readable content graph this mirrors.
- [/map/?view=graph](https://www.wheelofheaven.world/map/?view=graph) —
  the whole graph, which this figure is a scoped view of.
