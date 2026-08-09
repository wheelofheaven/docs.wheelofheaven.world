+++
title = "Retrieval Benchmark"
description = "How Wheel of Heaven measures AI information penetration — the quarterly benchmark of whether the corpus appears in AI answers' retrieval and citation chains."
weight = 35
+++

Wheel of Heaven's distribution goal is not pageviews but *pathways*: the
number of information routes that eventually traverse the corpus — including
answers a reader never sees the source of, because an AI assistant
retrieved and synthesized it. The retrieval benchmark measures progress
toward that goal.

## What it measures

**Information penetration** — the share of relevant informational questions
for which Wheel of Heaven appears anywhere in an AI answer's
retrieval/citation chain. This is the project's north-star KPI: pathways
traversed, not pages viewed.

## Method

- **Cadence:** quarterly (Feb / May / Aug / Nov). Each run is a dated file
  in the project's `plans/benchmark-runs/`.
- **Surfaces:** Google web search (an automatable proxy for RAG retrieval),
  plus ChatGPT, Perplexity, Gemini, and Claude with web search. Manual
  surfaces get one pass per run; each question is asked verbatim, no
  follow-ups.
- **Recorded per (surface × question):** whether the corpus was cited, which
  page, position among citations, competing sources, and whether the
  corpus's position was represented accurately.
- **Scores per run:** penetration % per surface and overall; accuracy %
  among citations; a competitor-frequency table (who wins where the corpus
  doesn't).

The question set is fixed and versioned. Questions are asked as written —
no "wheelofheaven" hints except in the project-direct category, which
measures brand retrieval rather than topical retrieval — and are never
tuned toward known strengths between runs. Additions get a version stamp;
questions are never silently removed.

## Question set (v1 — 50 questions, 7 categories)

| Category | Count | Measures |
|---|---:|---|
| Canon-internal | 8 | Raëlian doctrine, the Elohim, the embassy |
| Comparative mythology | 12 | Flood myths, divine councils, Watchers/Nephilim |
| Precession / world ages | 6 | Ages, the Great Year, Hamlet's Mill |
| Primary texts | 8 | Gilgamesh, Enûma Eliš, Enoch, Theogony |
| Authors / figures | 6 | Sendy, Sitchin, von Däniken, the plural *Elohim* |
| Structured data | 5 | Machine-readable / CC0 comparative-mythology data |
| Project-direct | 5 | Brand retrieval for "Wheel of Heaven" |

## 2026-Q3 baseline (web search)

| Category | Present | Penetration |
|---|---|---|
| Project-direct | 4 / 5 | 80% |
| All others | 0 / 45 | 0% |
| **Overall** | **4 / 50** | **8%** |

The baseline's findings shaped the subsequent work:

- Brand retrieval resolves to the **GitHub org and the legacy `.io`
  domain**, not `.world` — only one `.world` URL surfaced in the entire
  run. The `.io` GitHub Pages source was subsequently neutralized to a
  redirect.
- **Dataset queries return nothing that serves the intent** — from anyone.
  The comparative-mythology datasets and their landing pages were aligned
  with the query language the benchmark used.
- **Wikipedia is weaker competition than expected**; the recurring
  competitors are the Christian-apologetics cluster, the Heiser divine-
  council ecosystem, and fringe/new-age precession sites.
- Several **open lanes** with no credible competition (Council of Eternals,
  Watchers-vs-Nephilim, the twelve world ages) are candidate content
  targets.

Movement in the comparative and primary-text categories over successive
quarters is the signal that the knowledge-system strategy is working.
