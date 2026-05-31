+++
title = "Quickstart"
description = "The fastest path from zero to an LLM that can answer accurately about the Wheel of Heaven project."
weight = 10
template = "page.html"

[extra]
summary = "Three paths from zero to grounded answers — paste a manifest, paste the full corpus, or call the curated context API. Pick by context-window budget."
+++

The fastest path to an LLM that answers accurately about the Wheel of
Heaven project, in order of effort.

## Path A — single paste, small context

For a chat assistant, a quick prototype, or a model with a tight
context window (under 16K tokens).

Paste the contents of
[`https://www.wheelofheaven.world/llms.txt`](https://www.wheelofheaven.world/llms.txt)
into the system prompt. It is ~7K characters, ~1,800 tokens. It
contains:

- The working hypothesis in one paragraph.
- A list of what the project is and is not.
- The seven content sections with one-line descriptions and live URLs.
- The twelve precessional ages with their dates and one-line summaries.
- Key concepts with links to wiki entries.
- Routing rules ("for definitional questions, use the Wiki").
- Language entry points.
- API discovery URLs.

Prepend a short instruction:

```text
You are answering questions about the Wheel of Heaven project using
the manifest below as ground truth. When the manifest does not cover
a question, say so and recommend the relevant URL. Never invent dates,
quotes, or page contents. Cite URLs verbatim when you reference them.

---

<paste llms.txt here>
```

This gets you grounded answers about the project's structure,
chronology, and key terms. It will **not** let the model answer
detail-level questions about specific wiki entries or library texts —
for that, go to path B or C.

## Path B — full-corpus paste, large context

For a model with a 100K+ token context window where you want answers
without retrieval.

Paste the contents of
[`https://www.wheelofheaven.world/llms-full.txt`](https://www.wheelofheaven.world/llms-full.txt).
It is ~85K characters, ~22K tokens. It contains everything `llms.txt`
contains plus:

- The hypothesis stated in full (five interconnected components).
- The project's epistemic stance and editorial method.
- The precessional framework explained.
- Each of the twelve ages summarised at ~2–3 paragraphs.
- The project's positioning relative to adjacent traditions.

This is the corpus's **most ingestion-ready single artefact**. It is
designed as a one-file context block.

```text
You are answering questions about the Wheel of Heaven project using
the full corpus reference below as ground truth. Where you cite a
specific claim, label it "direct" / "inferred" / "speculative" per
the corpus's own epistemic discipline. Never invent quotes.

---

<paste llms-full.txt here>
```

## Path C — programmatic, retrieval-backed

For an agent, RAG pipeline, or anything that needs to scale beyond a
single paste.

Hit the curated context endpoints once at boot:

```bash
curl https://api.wheelofheaven.world/v1/context/
curl https://api.wheelofheaven.world/v1/context/hypothesis/
curl https://api.wheelofheaven.world/v1/context/terminology/
curl https://api.wheelofheaven.world/v1/context/timeline/
curl https://api.wheelofheaven.world/v1/context/sources/
curl https://api.wheelofheaven.world/v1/context/method/
```

Concatenate the `data.body` fields of those six responses into your
system prompt. Then, for per-question retrieval, hit
`/v1/wiki/{slug}/`, `/v1/timeline/{slug}/`, `/v1/articles/{slug}/`, or
`/v1/library/books/{slug}/chapters/{n}` as needed.

Walk-through with Python:

```python
import httpx

BASE = "https://api.wheelofheaven.world"

def curated_context() -> str:
    """Concatenate the six curated context documents into a block
    suitable for a system prompt."""
    keys = ["hypothesis", "terminology", "timeline", "sources", "method"]
    blocks = []
    for k in keys:
        r = httpx.get(f"{BASE}/v1/context/{k}/").json()
        blocks.append(f"## {r['data']['title']}\n\n{r['data']['body']}")
    return "\n\n---\n\n".join(blocks)


def wiki_entry(slug: str) -> dict:
    """Fetch a single wiki entry."""
    return httpx.get(f"{BASE}/v1/wiki/{slug}/").json()["data"]


def chapter(book_slug: str, n: int) -> dict:
    """Fetch a single library chapter."""
    return httpx.get(
        f"{BASE}/v1/library/books/{book_slug}/chapters/{n}"
    ).json()["data"]


system_prompt = f"""
You answer questions about the Wheel of Heaven project. Use the context
below as ground truth. Cite URLs verbatim. Surface the corpus's claim
type (direct / inferred / speculative) when answering a substantive
claim.

{curated_context()}
""".strip()
```

This pattern keeps the system prompt small (~5K tokens) and pulls
per-query detail on demand. Pair with retrieval — see
[Embeddings and RAG](@/ai-ingestion/embeddings-and-rag.md) — for any
non-trivial production deployment.

## Choosing between A, B, and C

| Path | Tokens at boot | Per-query retrieval | Use when |
|---|---|---|---|
| A (`llms.txt`) | ~1,800 | None | Tight context window, quick prototype, conversational assistant |
| B (`llms-full.txt`) | ~22,000 | None | Large context model, no infrastructure available, single-paste workflow |
| C (curated API) | ~5,000 | Yes | Agent, RAG, scaled deployment, multilingual, fine-grained answers |

If you don't know which to pick: **start with A**, upgrade to B when
the model starts inventing details, upgrade to C when B doesn't fit
or when you need per-query freshness.

## What to do next

- Read [System-prompt patterns](@/ai-ingestion/system-prompts.md) for
  the wording that has worked well in practice.
- Read [Curated context endpoints](@/ai-ingestion/context-endpoints.md)
  for what each `/v1/context/*` document contains and when to include
  each one.
- Read [Attribution](@/ai-ingestion/attribution.md) before shipping a
  product that surfaces the corpus.
