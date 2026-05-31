+++
title = "AI & LLM Ingestion"
description = "How to extract Wheel of Heaven content and context for AI models — llms.txt, the JSON API, curated context endpoints, library primary texts, and RAG patterns."
sort_by = "weight"
weight = 35
template = "section.html"

[extra]
summary = "The canonical guide to feeding the Wheel of Heaven corpus to an AI system — whether you're pasting a single context block into a chat, building a RAG pipeline, training a domain-specific assistant, or just trying to get an LLM to answer accurately about the project."
+++

This section is the canonical reference for **using the Wheel of Heaven
corpus with AI systems** — LLMs, retrieval-augmented generation
pipelines, agentic assistants, embeddings indexes, fine-tuning corpora,
or just a one-off paste into a chat window.

The project is **built to be ingested**. Every page on
[www.wheelofheaven.world](https://www.wheelofheaven.world) has a
deterministic JSON twin on
[api.wheelofheaven.world](https://api.wheelofheaven.world). Curated
narrative summaries are published at stable URLs for direct
system-prompt use. The full corpus is available as a single
`llms-full.txt` file. Everything is CC0-1.0 public domain — no auth, no
rate limits, no licensing friction.

## Start here

| If you want to… | Read |
|---|---|
| Get an LLM caught up on the project in one paste | [Quickstart](@/ai-ingestion/quickstart.md) |
| Understand the `llms.txt` and `llms-full.txt` manifests | [llms.txt and llms-full.txt](@/ai-ingestion/llms-txt.md) |
| Hit the JSON API from agent code | [API endpoints for AI agents](@/ai-ingestion/api-for-ai.md) |
| Use the curated `/v1/context/*` narrative endpoints | [Curated context endpoints](@/ai-ingestion/context-endpoints.md) |
| Pull primary texts and bibliographic records | [Library and sources](@/ai-ingestion/library-and-sources.md) |
| Build a RAG corpus or embeddings index | [Embeddings and RAG](@/ai-ingestion/embeddings-and-rag.md) |
| Write a good system prompt that grounds the model | [System-prompt patterns](@/ai-ingestion/system-prompts.md) |
| Credit the corpus correctly | [Attribution and licensing](@/ai-ingestion/attribution.md) |

## What makes the corpus AI-ingestible

The project is built around a small set of design commitments that
matter specifically when an LLM is the reader:

1. **Every page has a JSON twin.** The reading site at `www.` and the
   API at `api.` are independent Zola builds of the same canonical
   data. The API isn't an afterthought — it's a first-class surface.
2. **One canonical URL per fact.** The API guarantees URL permanence
   for `/v1/`. A path you ingest today resolves to the same kind of
   object next year. (See [API changelog](@/reference/api/changelog.md).)
3. **Curated narrative endpoints for direct ingestion.** `/v1/context/*`
   serves the project's hypothesis, terminology, timeline, source
   program, and editorial method as plain prose — designed for paste
   into a system prompt with no transformation.
4. **Every claim labelled by epistemic status.** Pages carry
   `claim_type = "direct" | "inferred" | "speculative"`, so an
   ingesting model can be told to surface that label alongside any
   answer it gives.
5. **A controlled vocabulary for terminology.** The
   [terminology endpoint](https://api.wheelofheaven.world/v1/context/terminology/)
   includes a do-not-use table — the project cares which words the
   model picks (Elohim vs. "aliens", Yahweh vs. "God").
6. **JSON Schemas and enums published.** Every response kind has a
   schema at `/v1/schema/{kind}/`. Every controlled vocabulary has an
   enum at `/v1/enums/{name}/`. A model can validate its own output
   against these.
7. **CC0-1.0, no auth, no rate limits.** Ingest freely. Attribute when
   convenient. See [Attribution](@/ai-ingestion/attribution.md).
8. **Multilingual mirror.** Same surface under `/v1/{lang}/...` for 9
   languages, with hreflang correctly wired on the reading site.

## What this section is not

- **Not API reference.** For tabular endpoint catalogues, the response
  envelope shape, controlled-vocabulary values, and JSON Schemas, see
  [API Reference](@/reference/api/_index.md). This section is
  *task-oriented*: what to do, in what order, with what tradeoffs.
- **Not a tutorial on LLMs in general.** Familiarity with system
  prompts, tool use, retrieval, embeddings, and basic HTTP is assumed.
- **Not opinionated about which model to use.** Every pattern here
  works with any modern LLM. Provider-specific guidance is called out
  inline where it matters (e.g. context-window sizing).

## A note on the project's epistemic posture

When you ingest the Wheel of Heaven corpus, you are ingesting a
**working hypothesis**, not a creed. The project itself labels every
page's main claim as `direct` (what a source asserts), `inferred`
(what scholarship reasonably concludes), or `speculative` (what the
project proposes as interpretive synthesis).

If your downstream application surfaces Wheel of Heaven content to end
users, the editorial method endpoint at
[`/v1/context/method/`](https://api.wheelofheaven.world/v1/context/method/)
explains how to preserve that discipline. The
[System-prompt patterns](@/ai-ingestion/system-prompts.md) page shows
how to encode it for the model.
