+++
title = "llms.txt and llms-full.txt"
description = "The two top-level manifests the project publishes for LLM ingestion — what each contains, when to use which, and how they're maintained."
weight = 20
template = "page.html"

[extra]
summary = "The project publishes both flavours of the llms.txt convention: a short navigational manifest and a long full-corpus reference. Both are stable URLs designed to be pasted directly into a system prompt."
+++

The Wheel of Heaven project publishes both flavours of the
[`llms.txt` convention](https://llmstxt.org/): a short manifest and a
long full-corpus reference. They sit at stable URLs and are designed
to be ingested by AI tools directly, with no transformation.

## The two files

| URL | Purpose | Size | When to use |
|---|---|---|---|
| [`/llms.txt`](https://www.wheelofheaven.world/llms.txt) | Navigational manifest | ~7K chars / ~1.8K tokens | System prompt, light context, "what is this project" |
| [`/llms-full.txt`](https://www.wheelofheaven.world/llms-full.txt) | Full corpus reference | ~85K chars / ~22K tokens | Single-paste ingestion for large-context models |

Both files are served by `www.wheelofheaven.world` and are
authoritative for the English corpus. The
[API site](https://api.wheelofheaven.world) also serves its own
`llms.txt` — a separate manifest for the API surface itself, not for
the reading content. See
[`api.wheelofheaven.world/llms.txt`](https://api.wheelofheaven.world/llms.txt).

## `llms.txt` — the navigational manifest

The short manifest follows the `llms.txt` spec: a brief project
description, a `>` blockquote summarising what the project is, then
sections of links with one-line annotations.

It contains:

- A one-paragraph statement of the project's working hypothesis.
- Three paragraphs of context (what the project is and is not).
- A "Content sections" list — the seven top-level sections of the
  reading site, each with a one-line role description and live URL.
- A "Twelve precessional ages" list — each age with its dates and a
  one-line summary.
- A "Key concepts" list — Elohim, precession, Great Year, World Age,
  Raëlism, *The Book Which Tells the Truth*, Genesis, *Hamlet's Mill*,
  Jean Sendy.
- A "How to route queries" block — for which kind of question, hit
  which section.
- A "Languages" block — per-language entry points.
- An "API access" block — discovery URLs for the JSON twin.
- A "Citing this source" block — CC0 + suggested citation format.
- Project information and optional sections.

The file is **handwritten and editorially curated**, not auto-generated.
It is the project's most carefully maintained AI-facing surface. When
the project's framing shifts (new editorial pass, new section, new key
concept), this file is updated as part of the same pass.

### Direct use

For a quick chat assistant:

```text
You are answering questions about the Wheel of Heaven project. The
manifest below is the project's own short description of itself.

<paste of https://www.wheelofheaven.world/llms.txt>
```

For an agent's tool description (e.g. a tool called `query_wheel_of_heaven`):

```text
This tool exposes the Wheel of Heaven project. The project's manifest:

<paste of https://www.wheelofheaven.world/llms.txt>

Use this tool when the user asks about ancient cosmology, the Elohim
hypothesis, the precessional ages, Raëlism, or related comparative
mythology. The tool returns either a URL to follow up on or a short
prose summary.
```

## `llms-full.txt` — the full-corpus reference

The full file follows the same `llms.txt` convention but is intended
as a single ingestion point for the full project, not just a manifest
of links. It contains:

- The full short manifest content (so you can paste either file, not
  both).
- **The Working Hypothesis** stated in five interconnected components.
- **The Project's Epistemic Stance** — claim labels, methodological
  commitments, self-positioning.
- **The Precessional Framework** — the astronomical phenomenon and the
  corpus's working dates.
- **The Twelve Ages** — each age summarised at ~2–3 substantive
  paragraphs covering its content, sources, and place in the larger
  arc.
- **The Project's Positioning** relative to adjacent traditions
  (Raëlism, ancient astronaut theory, biblical scholarship, comparative
  mythology, contemporary science).
- **Methodological Notes** on source families and authority tiers.
- **Key Concepts Glossary** in prose form.

The file is approximately 22,000 tokens. It fits comfortably in any
modern model's context window (GPT-4o, Claude Sonnet/Opus, Gemini,
Llama 70B+, Mistral Large all handle this trivially). For a 100K+ token
model, this is the simplest "give the model everything" pattern
available.

### Direct use

```text
You answer questions about the Wheel of Heaven project. Below is the
project's own full-corpus reference document. Treat it as ground truth.

When you answer a substantive claim, surface the corpus's epistemic
labelling: "direct" (a source says this), "inferred" (scholarship
concludes this), or "speculative" (the project proposes this).

When the document doesn't cover a specific detail, say so and point to
the relevant section URL.

<paste of https://www.wheelofheaven.world/llms-full.txt>
```

## How to keep your ingest fresh

Both files are stable URLs. The project does not version them — when
the corpus is updated, the files are updated in place. If you cache
them downstream:

- The reading site's edge cache returns these with the default
  Cloudflare TTL (~1 hour).
- The site rebuilds on every push to `main`, and Cloudflare purges the
  zone on deploy.
- For most ingestion patterns, refetching weekly is sufficient. For
  applications where accuracy is critical, refetch daily.

If you need to detect changes without refetching, the API publishes a
sitemap with `<lastmod>` per endpoint at
[`api.wheelofheaven.world/sitemap.xml`](https://api.wheelofheaven.world/sitemap.xml).
The `llms.txt` and `llms-full.txt` files themselves don't carry change
metadata; the API sitemap is the closest signal.

## Multilingual

`/llms.txt` and `/llms-full.txt` are **English only**. The corpus is
published in nine languages, but the manifests are not per-language —
the English manifests are authoritative.

The reasoning: an LLM consuming these files is overwhelmingly likely
to be using English as its internal working language, and the
project's editorial discipline (claim types, terminology, source
program) is most precisely expressed in English. If you need
per-language access, hit the JSON API under `/v1/{lang}/...` — see
[Multilingual](@/reference/api/multilingual.md).

## How the files are generated

`llms.txt` is **handwritten** in
[`www.wheelofheaven.world/static/llms.txt`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/static/llms.txt).
It is treated as editorial content — owned by the editorial pass, not
the build pipeline. When the project's framing shifts or a section is
added/retired, the file is updated by hand in the same PR.

`llms-full.txt` is similarly **handwritten** in
[`www.wheelofheaven.world/static/llms-full.txt`](https://github.com/wheelofheaven/www.wheelofheaven.world/blob/main/static/llms-full.txt).
It is more time-consuming to keep in sync with the live corpus — each
of the twelve age summaries is its own paragraph of editorial work —
but the manual maintenance is what lets the file stay sharp,
opinionated, and stable in style. The trade-off is intentional.

Both files are served from `/static/` by Zola, which means they appear
at the root of `www.wheelofheaven.world`.

## What `llms.txt` deliberately does not contain

- **Per-page bodies.** The manifest is navigational. For full bodies,
  fetch the JSON API.
- **Live numbers.** The manifest does not list "we have 111 wiki
  entries" because the number changes; it points at the listing
  endpoint instead.
- **The project's full bibliography.** That lives at
  [`/v1/sources/`](https://api.wheelofheaven.world/v1/sources/). The
  manifest only mentions key reference works.
- **Schema or enum values.** Those are machine surfaces — the manifest
  is for a human-language-trained model. Schemas live at `/v1/schema/`
  and enums at `/v1/enums/`.
