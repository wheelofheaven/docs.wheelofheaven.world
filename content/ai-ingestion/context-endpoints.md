+++
title = "Curated context endpoints"
description = "What each /v1/context/* endpoint contains, when to ingest it, and how to compose them into a system prompt."
weight = 40
template = "page.html"

[extra]
summary = "The /v1/context/* family is the project's most carefully maintained AI-facing surface: six handwritten narrative documents designed for direct system-prompt ingestion. Each one is independently useful; together they ground a model on the project end-to-end."
+++

The six endpoints under `/v1/context/*` are the project's most
carefully maintained AI-facing surface. They are **handwritten
narrative documents**, edited under the same editorial pass as the
reading site, designed for direct ingestion into an LLM system prompt
with no transformation.

This page covers what each contains, when to include it, and how to
compose them.

## The six endpoints

| Endpoint | Token cost | Hypothesis | Terminology | Timeline | Sourcing | Method |
|---|---|---|---|---|---|---|
| [`/v1/context/`](https://api.wheelofheaven.world/v1/context/) | ~500 | — | — | — | — | — |
| [`/v1/context/hypothesis/`](https://api.wheelofheaven.world/v1/context/hypothesis/) | ~1,500 | ✓ | partial | partial | — | — |
| [`/v1/context/terminology/`](https://api.wheelofheaven.world/v1/context/terminology/) | ~1,200 | — | ✓ | — | — | — |
| [`/v1/context/timeline/`](https://api.wheelofheaven.world/v1/context/timeline/) | ~2,000 | partial | — | ✓ | — | — |
| [`/v1/context/sources/`](https://api.wheelofheaven.world/v1/context/sources/) | ~1,500 | — | — | — | ✓ | partial |
| [`/v1/context/method/`](https://api.wheelofheaven.world/v1/context/method/) | ~1,000 | — | — | — | partial | ✓ |

"Partial" means the endpoint touches that area as context for its
main subject but isn't the canonical document for it.

## What each contains

### `/v1/context/`

The root context endpoint. Returns a `Context` payload with:

- A short project description.
- The seven content sections of the reading site, with one-line
  descriptions.
- A `sub_contexts` array — pointers to the five narrative documents
  below.
- A `links` block to the reading site, the API manifest, and `llms.txt`.

Use this as a **discovery endpoint**. Hit it once to learn what's
available; rarely useful on its own in a system prompt.

### `/v1/context/hypothesis/`

The project's central claim, stated as continuous prose. Covers:

- The five interconnected components of the working hypothesis (the
  Elohim are a literal plural; they are an advanced human civilization;
  religion is the long memory of their work; the work is organised
  along the precessional cycle; the current age is the age of
  disclosure).
- The status of the hypothesis as **working** — not creed, not proof.
- The interplay of source claim, comparative observation, and project
  synthesis.

Include this **whenever you need the model to understand what the
project is actually arguing**. The single most load-bearing context
document.

### `/v1/context/terminology/`

Canonical naming choices, with rationale and a do-not-use table.

Covers:

- *Elohim* — capitalize; plural; do not use "aliens" or "gods".
- *Yahweh* — the Elohim president; do not use "God" unless quoting.
- *Raëlism* / *Raëlian* — with the diaeresis.
- *Ancient astronaut theory* — academic term; do not use "ancient
  aliens".
- *World Age* / *Precessional Age* — distinct from "astrological age".
- *Great Year* vs *World Age* — distinguish the two scales.
- A "do not use" table mapping common misnamings to the canonical term.

Include this **in any application that surfaces the project to end
users in natural language**. Without it, models will reach for
familiar but wrong terms ("the aliens", "the gods", "Raelism").

### `/v1/context/timeline/`

The twelve precessional ages laid out as prose. Covers:

- A brief note on precession as an astronomical phenomenon.
- The corpus's working dates (each age ~2,160 years, equal divisions).
- Each of the twelve ages with its dates and a one-paragraph summary
  of its primary content.
- A note on the corpus's relationship to mainstream archaeology and
  chronology.

Include this **whenever your application surfaces deep-history
content**. Without it, models conflate the corpus's chronology with
conventional ancient-astronaut chronologies (Sitchin's Sumerian dates,
Hancock's Younger Dryas) or with astrological "ages".

### `/v1/context/sources/`

The project's source program — the six-tier authority model and the
source-family taxonomy.

Covers:

- **The six tiers**: Tier 0 (Raëlian canon, primary), Tier 1 (ancient
  primary texts), Tier 2 (scholarly), Tier 3 (scientific/historical),
  Tier 4 (comparative traditions), Tier 5 (critical/skeptical).
- **The source families**: raelian, biblical, mesopotamian, vedic,
  mesoamerican, comparative, scholarly, scientific, critical, etc.
- **The six-source rule** — new wiki entries and articles aim for one
  source from each tier where applicable.
- **The do-not-cite guardrails** — what counts as a source and what
  doesn't.

Include this **in any application that exposes the project's
bibliographic backbone** — search-with-citations, scholarly Q&A,
research assistants. Without it, models will cite any plausible-looking
source, including ones the project deliberately excludes.

### `/v1/context/method/`

The editorial method — how the corpus is written and what discipline
it imposes.

Covers:

- **Claim types** (direct / inferred / speculative) and their
  per-page labelling.
- **The six-source rule** in editorial terms.
- **Editorial passes** — the `YYYY-MM` date code system for tracking
  framing shifts (e.g. `2026-05`, the modern human-civilization pass).
- **Translation policy** — derivation from English, divergence
  handling, glossary versioning.
- **What the corpus is not** — not a creed, not movement publication,
  not generic ancient-astronaut content.

Include this **whenever your application asks the model to reason
about the corpus's claims, not just surface them**. It encodes the
discipline you want the model to inherit.

## Composing them

The five narrative endpoints are designed to be composed. Common
patterns:

### Minimal grounding (~2.5K tokens)

Include only the hypothesis. The model knows what the project argues,
nothing more.

```python
ctx = httpx.get(
    "https://api.wheelofheaven.world/v1/context/hypothesis/"
).json()["data"]["body"]
```

Suitable for a chatbot that should be able to **describe** the project
but not **reason within** it.

### Standard grounding (~5K tokens)

Include hypothesis + terminology + method.

```python
keys = ["hypothesis", "terminology", "method"]
ctx_blocks = [
    httpx.get(f"https://api.wheelofheaven.world/v1/context/{k}/")
         .json()["data"]["body"]
    for k in keys
]
ctx = "\n\n---\n\n".join(ctx_blocks)
```

Suitable for a general assistant. The model can describe the project,
use canonical terminology, and surface claim labels.

### Full grounding (~7.5K tokens)

All five narrative endpoints.

```python
keys = ["hypothesis", "terminology", "timeline", "sources", "method"]
ctx_blocks = [
    httpx.get(f"https://api.wheelofheaven.world/v1/context/{k}/")
         .json()["data"]["body"]
    for k in keys
]
ctx = "\n\n---\n\n".join(ctx_blocks)
```

Suitable for a deep-history assistant, a research tool, or anywhere
the model needs to reason about the corpus's chronology and
bibliographic discipline.

### Topic-tuned grounding

Pick the documents that match your application's surface area.

| Application | Documents |
|---|---|
| "What is the project" chatbot | hypothesis + terminology |
| Deep-history Q&A | hypothesis + timeline + method |
| Citation-aware research tool | hypothesis + sources + method |
| Multilingual surface | hypothesis + terminology + (per-lang glossary) |
| Generative ("write a wiki entry in our style") | hypothesis + terminology + sources + method |

## How fresh are these?

The context endpoints are served with a **24-hour edge TTL**, the
longest TTL in the API. Cloudflare purges on every deploy, so the
upper bound on staleness is 24 hours or the time since last deploy,
whichever is shorter.

For agents that boot once a day, a fresh fetch at boot is sufficient.
For long-running agents, refetching every 24 hours is sufficient.

## What these endpoints don't contain

- **Per-page bodies.** The narrative documents summarise; they don't
  reproduce wiki entries. For specific entries, hit `/v1/wiki/{slug}/`.
- **Live counts.** No "we currently have 111 wiki entries". These are
  editorially curated documents, not dashboards.
- **Bibliographic records.** The `sources/` document explains the
  *program*; for the records themselves, hit `/v1/sources/`.
- **News dispatches.** Time-anchored content lives at `/v1/news/`.
  The context endpoints are evergreen.

## How these endpoints are generated

The five narrative documents are **handwritten Markdown** files in
[`api.wheelofheaven.world/content/v1/context/`](https://github.com/wheelofheaven/api.wheelofheaven.world/tree/main/content/v1/context).
They are rendered through a Zola template into the JSON envelope at
build time. The Markdown source is the editorial artefact; the JSON
response is the machine-readable wrapper.

When the project's editorial pass shifts, these documents are
rewritten in the same pass. They are not derived from other content —
they are first-class editorial output.
