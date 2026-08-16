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

A comparative table of eleven ancient flood traditions (Sumerian, *Atra-ḫasīs*,
*Gilgamesh* XI, *Genesis*, *Qurʾān*, Deucalion, Berossus, *Śatapatha Brāhmaṇa*,
the Aztec *Leyenda de los Soles*, the Andean Viracocha chronicles, and the Norse
*Prose Edda*). Version 1.1.

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

Seventeen attestations of the divine council — the assembly of divine beings that
governs and decides — across twelve traditions (Ugaritic *Baal Cycle*; Hebrew
*Psalm* 82, *1 Kings* 22, *Job*, *Deut* 32, *Isaiah* 6; Babylonian *Enūma Eliš*
and *Atra-ḫasīs*; Sumerian *Enlil and Ninlil*; the *Book of the Watchers*; the
Hurrian-Hittite *Song of Emergence*; Greek *Iliad*; Roman *Metamorphoses*;
Egyptian *Contendings of Horus and Seth*; Norse *Völuspá*; Hindu *Mahābhārata*;
and the Latter-day Saint premortal council). Version 1.1.

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

## Prophets & Religions Catalogue

48 religious traditions **extracted from the markdown table** in the
[list-of-prophets-and-religions](https://www.wheelofheaven.world/wiki/list-of-prophets-and-religions/)
wiki entry (links and bold stripped, wiki links captured).

| Format | URL |
|---|---|
| CSV | `https://api.wheelofheaven.world/v1/datasets/prophets-and-religions.csv` |
| JSON | `https://api.wheelofheaven.world/v1/datasets/prophets-and-religions.json` |

Columns: `tradition`, `period`, `founder`, `authenticity`, `principal_content`,
`woh_wiki`. Note the `authenticity` column is the **corpus's** assessment of the
founding-contact claim (Canonical → Highly unlikely), not a neutral rating — the
landing page says so explicitly. Landing page:
[`/datasets/prophets-and-religions/`](https://www.wheelofheaven.world/datasets/prophets-and-religions/).

## Myth Index

A cross-cultural index of **75 myth-motif attestations across 9 families** —
flood, divine council, theomachy, creation of humans, sky-descent, tower of
Babel, giants, garden-paradise, immortality quest. One row per attestation,
with named primary text, locator, summary, and **Thompson Motif-Index**
cross-references. The flood / divine-council / theomachy rows unify the three
specialized concordances (each row's `see_dataset` points at the table with
the full per-family column depth); the other six families are new curation.

| Format | URL |
|---|---|
| CSV | `https://api.wheelofheaven.world/v1/datasets/myth-index.csv` |
| JSON | `https://api.wheelofheaven.world/v1/datasets/myth-index.json` |

Columns: `motif_family`, `tradition`, `source_text`, `reference`, `summary`,
`thompson_motifs` (array in JSON, `;`-joined in CSV), `atu_type`,
`aarne_1910_type` (deliberately sparse — ATU catalogues folktales, myth is
addressed by the Motif-Index A-section), `woh_wiki`, `woh_library`,
`see_dataset`, `woh_reading` (the canon reading, kept separate from the
source-describing `summary`). Landing page:
[`/datasets/myth-index/`](https://www.wheelofheaven.world/datasets/myth-index/).

## Aarne 1910 Tale-Type Index

A complete structured digitization of Antti Aarne's *Verzeichnis der
Märchentypen* (FFC 3, Helsinki 1910) — the founding catalogue of the
Aarne–Thompson–Uther system. **603 rows** (every numbered type and lettered
subtype), German title/description, full section structure and group
captions, Grundtvig/Grimm cross-references, page numbers, and English glosses
for all 533 titled types. Parsed from the proofread German Wikisource
transcription (`Seite:FFC3.djvu`, status *fertig*); the 1910 text is public
domain worldwide (Aarne d. 1925), unlike the still-copyrighted 1928/1961/2004
editions, so this is the provenance-clean structured edition.

| Format | URL |
|---|---|
| CSV | `https://api.wheelofheaven.world/v1/datasets/aarne-1910-tale-types.csv` |
| JSON | `https://api.wheelofheaven.world/v1/datasets/aarne-1910-tale-types.json` |

Columns: `type_label`, `type_start`, `type_end`, `subtype`, `title_de`,
`description_de`, `title_en`, `part`, `division`, `subsection`,
`group_label`, `group_title`, `grundtvig_no`, `grimm_no`, `page`. Caveat for
users: this is the **1910 numbering** — most numbers survive into ATU 2004,
but later editions added, merged, and renumbered some types. Landing page:
[`/datasets/aarne-1910-tale-types/`](https://www.wheelofheaven.world/datasets/aarne-1910-tale-types/).

## Grimm KHM Tale-Type Crosswalk

All **211 tales** of the Grimms' *Kinder- und Hausmärchen* in the canonical
1857 numbering (KHM 1–200 + 151a, and the 10 children's legends as KL 1–10)
with German/English titles, **ATU tale-type numbers** (per Ashliman's
standard concordance — type mappings as facts), an `aarne_1910_types` column
**inverted from the aarne-1910-tale-types dataset's own `grimm_no`
citations** (153 provenance-clean joins from the 1910 text itself),
first-edition data (1812/15–1857) and 1857 Wikisource links parsed from the
German Wikisource edition tables.

| Format | URL |
|---|---|
| CSV | `https://api.wheelofheaven.world/v1/datasets/grimm-khm-index.csv` |
| JSON | `https://api.wheelofheaven.world/v1/datasets/grimm-khm-index.json` |

Columns: `khm_no`, `part` (KHM \| KL), `title_de`, `title_en`, `atu_type`,
`atu_episode_types`, `type_note`, `aarne_1910_types`, `first_edition`,
`wikisource_de`. 13 tales are honestly `atu_type`-blank (unclassified in the
ATU system). Landing page:
[`/datasets/grimm-khm-index/`](https://www.wheelofheaven.world/datasets/grimm-khm-index/).

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

## Mirrors & external distribution

The datasets are CC0, so beyond the API + landing pages here, we mirror them on
high-authority data platforms — for backlinks, for reach into the ML and
data-science communities, and for a second discovery surface. Every external
copy links back to its `/datasets/{slug}/` landing page, and every landing page
links out to its mirrors (an **Also available on** section).

### HuggingFace

All six datasets are published under the
[`wheelofheaven`](https://huggingface.co/wheelofheaven) organization:

| Dataset | HuggingFace |
|---|---|
| Content Graph | [wheelofheaven/content-graph](https://huggingface.co/datasets/wheelofheaven/content-graph) |
| Flood-Myth Concordance | [wheelofheaven/flood-myths](https://huggingface.co/datasets/wheelofheaven/flood-myths) |
| Divine-Council Index | [wheelofheaven/divine-council-index](https://huggingface.co/datasets/wheelofheaven/divine-council-index) |
| Theomachy Cross-References | [wheelofheaven/theomachy-crossrefs](https://huggingface.co/datasets/wheelofheaven/theomachy-crossrefs) |
| Precessional World Ages | [wheelofheaven/world-ages](https://huggingface.co/datasets/wheelofheaven/world-ages) |
| Prophets & Religions Catalogue | [wheelofheaven/prophets-and-religions](https://huggingface.co/datasets/wheelofheaven/prophets-and-religions) |
| Myth Index | [wheelofheaven/myth-index](https://huggingface.co/datasets/wheelofheaven/myth-index) |
| Aarne 1910 Tale-Type Index | [wheelofheaven/aarne-1910-tale-types](https://huggingface.co/datasets/wheelofheaven/aarne-1910-tale-types) |
| Grimm KHM Tale-Type Crosswalk | [wheelofheaven/grimm-khm-index](https://huggingface.co/datasets/wheelofheaven/grimm-khm-index) |

Each repo carries a dataset card (`README.md`) with the CC0 license, tags, the
column list, and a link back to the landing page.

### Kaggle

All six are also published under
[`zarazinsfuss`](https://www.kaggle.com/zarazinsfuss) on Kaggle. Kaggle matters
beyond reach — **Kaggle is itself a Google Dataset Search source**, so it
restores the second Dataset-Search listing without a DOI.

| Dataset | Kaggle |
|---|---|
| Content Graph | [zarazinsfuss/content-graph](https://www.kaggle.com/datasets/zarazinsfuss/content-graph) |
| Flood-Myth Concordance | [zarazinsfuss/flood-myths](https://www.kaggle.com/datasets/zarazinsfuss/flood-myths) |
| Divine-Council Index | [zarazinsfuss/divine-council-index](https://www.kaggle.com/datasets/zarazinsfuss/divine-council-index) |
| Theomachy Cross-References | [zarazinsfuss/theomachy-crossrefs](https://www.kaggle.com/datasets/zarazinsfuss/theomachy-crossrefs) |
| Precessional World Ages | [zarazinsfuss/world-ages](https://www.kaggle.com/datasets/zarazinsfuss/world-ages) |
| Prophets & Religions Catalogue | [zarazinsfuss/prophets-and-religions](https://www.kaggle.com/datasets/zarazinsfuss/prophets-and-religions) |
| Myth Index | [zarazinsfuss/myth-index](https://www.kaggle.com/datasets/zarazinsfuss/myth-index) |
| Aarne 1910 Tale-Type Index | [zarazinsfuss/aarne-1910-tale-types](https://www.kaggle.com/datasets/zarazinsfuss/aarne-1910-tale-types) |
| Grimm KHM Tale-Type Crosswalk | [zarazinsfuss/grimm-khm-index](https://www.kaggle.com/datasets/zarazinsfuss/grimm-khm-index) |

These live under the **personal account**, not an org: Kaggle has suspended
organization creation for regular users, so there is no `wheelofheaven` Kaggle
org (unlike HuggingFace). It's cosmetic — ownership by a person is the Kaggle
norm and changes nothing about discoverability. One gotcha: Kaggle uses a
**controlled tag vocabulary**, so our free-text keywords are dropped on upload
and the Kaggle copies currently publish untagged.

### Why not a DOI repository

We evaluated Zenodo and the other DOI-minting archives. Zenodo automatically
**de-ranks uploads from unverified individual accounts** — hiding them from its
own search while leaving them visible to duplicate-checkers — which would defeat
the whole discoverability goal. HuggingFace + Kaggle give high-authority
backlinks and a real audience without that risk. If academic DOIs become
worthwhile later, **Harvard Dataverse** or **OSF** are the individual-friendly,
Dataset-Search-indexed options (both mint DataCite DOIs, neither de-ranks
individuals).

### Rebuilding & re-uploading

Packaging is scripted — see
[Dataset distribution](/contributing/dev/dataset-distribution/) for the
`build_distribution.py` packager and the HuggingFace / Kaggle upload flow.

## Translation datasets (HuggingFace + Kaggle)

Separately from the extracted content datasets above, the CC0 books of the
**Wheel of Heaven Translation Program** are published as verse-aligned parallel
corpora (source script ↔ WoH English) with transliteration, manuscript-witness
attribution, per-verse commentary, and a translation glossary. Where an aligned
public-domain edition exists (10 of the 14 books), each row also carries a
**reference translation** (`reference_english` — the ASV 1901, the World English
Bible, or a period edition such as R. H. Charles's 1917 *Enoch*) joined
verse-by-verse, so the Wheel of Heaven rendering can be measured against a
neutral control. The dataset is honestly mixed-license: the Wheel of Heaven layer
is CC0-1.0, the reference column is public domain. **14 books** are live on both
the [`wheelofheaven`](https://huggingface.co/wheelofheaven) HuggingFace org and
[`zarazinsfuss`](https://www.kaggle.com/zarazinsfuss) on Kaggle (same slug on
both platforms):

| Book | Verses | Review status | HuggingFace | Kaggle |
|---|---|---|---|---|
| Theogony | 1,042 | reviewed per chapter | [theogony-woh](https://huggingface.co/datasets/wheelofheaven/theogony-woh) | [theogony-woh](https://www.kaggle.com/datasets/zarazinsfuss/theogony-woh) |
| Sumerian King List | 435 | reviewed per chapter | [sumerian-king-list-woh](https://huggingface.co/datasets/wheelofheaven/sumerian-king-list-woh) | [sumerian-king-list-woh](https://www.kaggle.com/datasets/zarazinsfuss/sumerian-king-list-woh) |
| Enki and Ninḫursaĝa | 256 | reviewed per chapter | [enki-and-ninhursag-woh](https://huggingface.co/datasets/wheelofheaven/enki-and-ninhursag-woh) | [enki-and-ninhursag-woh](https://www.kaggle.com/datasets/zarazinsfuss/enki-and-ninhursag-woh) |
| Enki and Ninmaḫ | 141 | reviewed per chapter | [enki-and-ninmah-woh](https://huggingface.co/datasets/wheelofheaven/enki-and-ninmah-woh) | [enki-and-ninmah-woh](https://www.kaggle.com/datasets/zarazinsfuss/enki-and-ninmah-woh) |
| Song of the Hoe | 110 | reviewed per chapter | [song-of-the-hoe-woh](https://huggingface.co/datasets/wheelofheaven/song-of-the-hoe-woh) | [song-of-the-hoe-woh](https://www.kaggle.com/datasets/zarazinsfuss/song-of-the-hoe-woh) |
| Isaiah (partial) | 94 | reviewed per chapter | [isaiah-woh](https://huggingface.co/datasets/wheelofheaven/isaiah-woh) | [isaiah-woh](https://www.kaggle.com/datasets/zarazinsfuss/isaiah-woh) |
| Genesis | 1,533 | reviewed per chapter | [genesis-woh](https://huggingface.co/datasets/wheelofheaven/genesis-woh) | [genesis-woh](https://www.kaggle.com/datasets/zarazinsfuss/genesis-woh) |
| Book of Enoch | 403 | signed off | [book-of-enoch-woh](https://huggingface.co/datasets/wheelofheaven/book-of-enoch-woh) | [book-of-enoch-woh](https://www.kaggle.com/datasets/zarazinsfuss/book-of-enoch-woh) |
| Jubilees | 373 | signed off | [jubilees-woh](https://huggingface.co/datasets/wheelofheaven/jubilees-woh) | [jubilees-woh](https://www.kaggle.com/datasets/zarazinsfuss/jubilees-woh) |
| Daniel | 357 | signed off | [daniel-woh](https://huggingface.co/datasets/wheelofheaven/daniel-woh) | [daniel-woh](https://www.kaggle.com/datasets/zarazinsfuss/daniel-woh) |
| Matthew | 287 | pending verification | [matthew-woh](https://huggingface.co/datasets/wheelofheaven/matthew-woh) | [matthew-woh](https://www.kaggle.com/datasets/zarazinsfuss/matthew-woh) |
| Exodus | 175 | reviewed per chapter | [exodus-woh](https://huggingface.co/datasets/wheelofheaven/exodus-woh) | [exodus-woh](https://www.kaggle.com/datasets/zarazinsfuss/exodus-woh) |
| Job | 151 | reviewed per chapter | [job-woh](https://huggingface.co/datasets/wheelofheaven/job-woh) | [job-woh](https://www.kaggle.com/datasets/zarazinsfuss/job-woh) |
| Acts | 146 | pending verification | [acts-woh](https://huggingface.co/datasets/wheelofheaven/acts-woh) | [acts-woh](https://www.kaggle.com/datasets/zarazinsfuss/acts-woh) |
| Ezekiel | 78 | reviewed per chapter | [ezekiel-woh](https://huggingface.co/datasets/wheelofheaven/ezekiel-woh) | [ezekiel-woh](https://www.kaggle.com/datasets/zarazinsfuss/ezekiel-woh) |
| Shiur Qomah | 67 | pending verification | [shiur-qomah-woh](https://huggingface.co/datasets/wheelofheaven/shiur-qomah-woh) | [shiur-qomah-woh](https://www.kaggle.com/datasets/zarazinsfuss/shiur-qomah-woh) |
| Revelation | 48 | pending verification | [revelation-woh](https://huggingface.co/datasets/wheelofheaven/revelation-woh) | [revelation-woh](https://www.kaggle.com/datasets/zarazinsfuss/revelation-woh) |
| Luke | 38 | pending verification | [luke-woh](https://huggingface.co/datasets/wheelofheaven/luke-woh) | [luke-woh](https://www.kaggle.com/datasets/zarazinsfuss/luke-woh) |
| Mark | 20 | pending verification | [mark-woh](https://huggingface.co/datasets/wheelofheaven/mark-woh) | [mark-woh](https://www.kaggle.com/datasets/zarazinsfuss/mark-woh) |
| Qur'an | 16 | pending verification | [quran-woh](https://huggingface.co/datasets/wheelofheaven/quran-woh) | [quran-woh](https://www.kaggle.com/datasets/zarazinsfuss/quran-woh) |

Each card carries an honest **review-status** line — `signed off`,
`reviewed per chapter`, `pending verification`, or `draft` — so the packager
never claims a sign-off a book doesn't have.

**Selection.** A `-woh` book ships only if it is (1) **CC0** (`versionLicense`),
(2) **not HELD**, and (3) **has translated verses**. The packager skips stubs and
source-only books (13 `-woh` books have no translation yet — the tier list is by
*license*, not *content*, so always check for verses). **HELD** excludes three
living-tradition scriptures pending a rights review (`hidden-words-woh` Bahá'í,
`oomoto-shinyu-woh` Oomoto, `thanh-ngon-hiep-tuyen-woh` Caodai). The Raëlian
canon (`the-book-which-tells-the-truth`,
`extraterrestrials-took-me-to-their-planet`) is © International Raëlian Movement
(not CC0) and excluded outright. Packaged by
`data-library/scripts/build_translation_datasets.py`; see
[Dataset distribution](/contributing/dev/dataset-distribution/).
