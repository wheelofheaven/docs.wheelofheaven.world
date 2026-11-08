+++
title = "Knowledge graph (/graph/)"
description = "The /graph/ page — every page, topic, core claim and cited source as one canvas graph, distilled from the corpus by scripts/build_graph.py, with a controlled topic vocabulary."
template = "page.html"
weight = 95
+++

`/graph/` draws the whole corpus as one graph: **1,172 nodes and 5,879
links** at launch (2026-11-07) — every English page (wiki, articles,
timeline, news, library, datasets), every topic of the vocabulary, every
core claim record and every cited source. It replaced the second mode of
the map (`/map/?view=graph`, which now redirects here), a 167-node SVG
drawn from the API's page-only content graph.

**Source:**
[`templates/graph.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/graph.html)
· [`static/js/knowledge-graph.js`](https://github.com/wheelofheaven/bifrost/blob/main/static/js/knowledge-graph.js)
· [`sass/pages/_graph.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/pages/_graph.scss)
· www [`scripts/build_graph.py`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/scripts/build_graph.py)
· www [`data/graph/topics.toml`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/data/graph/topics.toml)

## The data: `static/graph/graph.json`

`mise run graph` (part of `mise run build`) distils the graph. Since
2026-11-08 it also writes the [topic pages](../topics/) data and stubs.

| Nodes | From |
|---|---|
| page kinds `wiki`, `article`, `timeline`, `news`, `book`, `dataset` | `content/{section}/*.md` (English) |
| `topic` | `data/graph/topics.toml` |
| `claim` | the core repository beside www (`--core ../core`); skipped with a warning if absent |
| `source` | `data/sources.json` — only sources some page cites |

| Link type | Meaning |
|---|---|
| `about` | page → topic, by the topic's `match` terms against the page's title, alternative names, keywords, category, description and summary; library books also by catalog tradition |
| `broader` | topic → broader topic |
| `defines` | the wiki entry that defines a topic |
| `links` / `see_also` | body links (`{% wiki %}`, `{% library %}`, markdown) / curated see-also |
| `cites` | page → source |
| `binds` / `depends_on` | page → core claim (`core_claim_ids`) / claim → claim |
| `quotes` | Raëlian book → scripture book it quotes (`data/canon_citations`) |
| `precedes` | precessional age → next age |

Each run prints a coverage report — topics nothing is filed under, pages
that match no topic — which is the vocabulary's to-do list.

## The topic vocabulary

Modelled on raskell.io's `data/tags.toml`: one entry per slug, with `name`,
`kind` (theme, tradition, figure, method, science, future), a one-sentence
`description`, `broader` parents, an optional defining wiki `page`, and
lower-case `match` phrases (whole-word). Add the entry, run `mise run
graph`, read the report. Keep match terms specific: a bare "greek" or
"bible" files hundreds of pages under the wrong hub.

## The renderer

A canvas, no libraries. The layout is the d3-force model hand-rolled:
Barnes–Hut many-body repulsion (topics carry the most charge, so hubs
spread out), springs weakened by degree, a weak centre pull, ~300 ticks
from a deterministic sunflower start — the same picture on every visit.
Labels are placed by priority (focus and neighbours, then topics, then
pages by degree) on a screen-space occupancy grid, so they never overlap.

Interaction: drag to pan; ⌘/Ctrl + wheel or pinch to zoom (plain wheel
scrolls the page and shows a hint; full screen zooms on any wheel); tap a
node for its card and lit neighbourhood; legend chips hide/show kinds;
search selects; `#node=<id>` deep-links; Escape closes. Colours are CSS
tokens (`--kg-<kind>`) per theme. The site's corner FABs are hidden on
this page; the graph has its own search.

## Distribution

Downloadable from the page (`wheel-of-heaven-graph.json`, CORS open), and
on Hugging Face as
[`wheelofheaven/knowledge-graph`](https://huggingface.co/datasets/wheelofheaven/knowledge-graph)
(graph.json + nodes.jsonl + links.jsonl, CC0). The older page-only
`content-graph` dataset is unchanged.

## Related

- [Narrative map](../narrative-map/) — the poster view of the same corpus.
- [Datasets reference](../../../reference/datasets/)
- [Topic pages (/topics/)](../topics/) — the vocabulary as pages; topic nodes open them.
