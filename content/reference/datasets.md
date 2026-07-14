+++
title = "Datasets"
description = "The downloadable CC0 datasets published from the corpus — the content-graph, its formats, API endpoints, and the /datasets/ landing pages."
weight = 30
+++

Wheel of Heaven publishes downloadable, CC0 datasets extracted from the live
corpus (Decision 15, G2). Each dataset has three faces: **files** on the API,
a **landing page** on www, and **schema.org/Dataset** markup for
[Google Dataset Search](https://datasetsearch.research.google.com/).

## Content Graph

A typed relatedness graph over the English corpus — every page is a node, every
curated *See also* link and in-text cross-reference a typed edge.

### Downloads

| Format | URL | For |
|---|---|---|
| JSON | `https://api.wheelofheaven.world/v1/graph/content-graph.json` | Self-describing — load and read `nodes`, `edges`, `stats`, `qa`. |
| GraphML | `https://api.wheelofheaven.world/v1/graph/content-graph.graphml` | Gephi, Cytoscape, `networkx`. |

### API endpoints

| Endpoint | Returns |
|---|---|
| `/v1/graph/` | The full graph in the standard envelope (nodes, edges, stats, **qa**). |
| `/v1/graph/{section}/{slug}/` | A single node's ego-network (out/in edges + neighbours). |
| `/v1/schema/content-graph/` | JSON Schema for the graph. |

### Format

- **Nodes** — `id` (`section/slug`), `section`, `slug`, `kind`, `title`, `url`,
  `graph_url`, `claim_type`, `category`, `degree`.
- **Edges** — directed, typed: `see_also` (curated) and `in_body` (prose
  cross-link). `{ source, target, type }`.
- **qa** — `orphans`, `asymmetric_see_also`, and `dangling` links. Shipped in
  the file; it's the project's broken-cross-link guard (the `{% wiki %}`
  shortcode builds `/wiki/{slug}/` with no existence check, so the graph QA is
  the only thing that catches typo'd or missing targets).

### How it's generated

`build_graph()` in
[`api.wheelofheaven.world/scripts/prebuild.py`](https://github.com/wheelofheaven/api.wheelofheaven.world/blob/main/scripts/prebuild.py)
walks the English content, builds the typed graph, and (via
`_write_graph_datasets`) emits the JSON + GraphML into `static/v1/graph/` on
every build. English only — for per-language relatedness, use each page's own
*See also* block.

## Flood-Myth Concordance

A comparative table of eight ancient flood traditions (Sumerian, *Atra-ḫasīs*,
*Gilgamesh* XI, *Genesis*, *Qurʾān*, Deucalion, Berossus, *Śatapatha Brāhmaṇa*).

| Format | URL |
|---|---|
| CSV | `https://api.wheelofheaven.world/v1/datasets/flood-myths.csv` |
| JSON | `https://api.wheelofheaven.world/v1/datasets/flood-myths.json` (self-describing: `columns` + `rows`) |

Columns: `tradition`, `source_text`, `approx_date`, `survivor`,
`flood_decreed_by`, `warned_by`, `cause`, `vessel`, `birds_released`,
`landing_place`, `aftermath`, `woh_library` (link to the digitized text where
one is published). Unlike the content graph, this is **hand-curated** —
committed static files under `api/static/v1/datasets/`, not build-generated.
Landing page: [`/datasets/flood-myths/`](https://www.wheelofheaven.world/datasets/flood-myths/).

## Divine-Council Index

Eleven attestations of the divine council — the assembly of divine beings that
governs and decides — across six traditions (Ugaritic *Baal Cycle*; Hebrew
*Psalm* 82, *1 Kings* 22, *Job*, *Deut* 32, *Isaiah* 6; Babylonian *Enūma Eliš*
and *Atra-ḫasīs*; the *Book of the Watchers*; the Hurrian-Hittite *Song of
Emergence*; and the Latter-day Saint premortal council).

| Format | URL |
|---|---|
| CSV | `https://api.wheelofheaven.world/v1/datasets/divine-council-index.csv` |
| JSON | `https://api.wheelofheaven.world/v1/datasets/divine-council-index.json` |

Columns: `tradition`, `source_text`, `reference`, `council_term` (in the
original), `presiding_figure`, `members`, `function`, `woh_library`.
Hand-curated static files under `api/static/v1/datasets/`. Landing page:
[`/datasets/divine-council-index/`](https://www.wheelofheaven.world/datasets/divine-council-index/).

## Theomachy Cross-References

The combat myth (*Chaoskampf*) across eight traditions — Marduk/Tiamat,
Baal/Yam, Yahweh/Leviathan, Zeus/Typhon, Indra/Vṛtra, Storm-god/Illuyanka,
Ra/Apophis, Michael/dragon.

| Format | URL |
|---|---|
| CSV | `https://api.wheelofheaven.world/v1/datasets/theomachy-crossrefs.csv` |
| JSON | `https://api.wheelofheaven.world/v1/datasets/theomachy-crossrefs.json` |

Columns: `tradition`, `source_text`, `reference`, `champion`, `adversary`,
`chaos_form`, `weapon`, `outcome`, `woh_library`. Hand-curated; only published
source texts get a `woh_library` link (4 of 8). Landing page:
[`/datasets/theomachy-crossrefs/`](https://www.wheelofheaven.world/datasets/theomachy-crossrefs/).

## Precessional World Ages

The 12 precessional World Ages on the corpus's reckoning (Capricorn → Aquarius,
each ~2,160 years), **extracted from the `/timeline/` entries** rather than
hand-curated — so the dataset and the site stay in step.

| Format | URL |
|---|---|
| CSV | `https://api.wheelofheaven.world/v1/datasets/world-ages.csv` |
| JSON | `https://api.wheelofheaven.world/v1/datasets/world-ages.json` |

Columns: `age`, `zodiac`, `symbol`, `start_year`, `end_year`, `genesis_day`
(the corpus maps the first eight ages onto the Genesis "days"), `url`, `summary`.
Extraction gotcha: several timeline files start with a blank line before the
`+++` frontmatter, so parse with `re.search` (not `re.match`). Landing page:
[`/datasets/world-ages/`](https://www.wheelofheaven.world/datasets/world-ages/).

## Landing pages

Human-facing landing pages live under `/datasets/`, e.g.
[`/datasets/content-graph/`](https://www.wheelofheaven.world/datasets/content-graph/).
Each is a `data-content` page using the bifrost `dataset-page.html` template,
which renders a stats grid, download cards, the body prose, and a
**"Cite this dataset"** block (plain citation + BibTeX). The
`partials/schema/dataset.html` partial emits the `schema.org/Dataset` JSON-LD
(name, license, `DataDownload` distributions, keywords) that Google Dataset
Search indexes.

### Adding a dataset

Create `content/datasets/{slug}.md` with `template = "dataset-page.html"` and an
`[extra]` block:

```toml
[extra]
license = "CC0-1.0"
license_url = "https://creativecommons.org/publicdomain/zero/1.0/"
keywords = ["…"]
api_url = "…"
schema_url = "…"
stats = [{ label = "Nodes", value = "…" }]
downloads = [{ label = "JSON", url = "…", format = "application/json", note = "…" }]
citation_text = "…"
citation_bibtex = '''@misc{…}'''
```

The page body (markdown) describes the dataset; the template and schema partial
handle the rest.
