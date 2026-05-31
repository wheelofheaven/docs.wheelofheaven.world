+++
title = "Embeddings and RAG"
description = "How to build a retrieval-augmented generation corpus from Wheel of Heaven content — chunking strategies, metadata, the search index, and pipeline patterns."
weight = 60
template = "page.html"

[extra]
summary = "Building a RAG corpus from Wheel of Heaven content. Covers the per-content-type chunking strategies that actually work, what metadata to attach to each chunk, the pre-built search index for client-side use, and a complete end-to-end example."
+++

This page covers building a retrieval-augmented generation (RAG)
pipeline from the Wheel of Heaven corpus — chunking, embedding,
metadata, and retrieval patterns.

For the per-endpoint shape of the data, see
[API endpoints for AI agents](@/ai-ingestion/api-for-ai.md). This page
assumes you have working access to the API and the curated context
endpoints.

## Two-tier retrieval, always

The corpus is structured around a deliberate two-tier pattern:

1. **Curated narrative documents** at `/v1/context/*` — load these
   into the system prompt at boot.
2. **Per-page bodies** at `/v1/{kind}/{slug}/` — retrieve these on
   demand via embeddings or keyword search.

A RAG pipeline that ignores tier 1 and only embeds tier 2 will produce
ungrounded retrieval. The model will surface facts but not the
project's epistemic stance. Always ship both.

## Choosing what to embed

The corpus has multiple content surfaces with very different
retrieval characteristics. Recommended embedding strategy per surface:

| Surface | Embed? | Chunk strategy |
|---|---|---|
| Wiki entries | Yes | One chunk per entry — bodies are typically < 1K tokens |
| Timeline ages | Yes | Multiple chunks per page — bodies are 3–10K tokens |
| Articles | Yes | Multiple chunks per article — bodies are 1.5–3K tokens |
| News dispatches | Yes (with decay) | One chunk per dispatch — bodies are < 800 words |
| Library chapters | Yes | One chunk per **paragraph** — preserve `c{ch}p{n}` ref |
| Tradition hubs | Yes | One chunk per hub — bodies are 1–2K tokens |
| Sources (bibliography) | Optional | One chunk per source record — useful for "find me a source about X" |
| Glossary | No | Lookup table, not retrieval material |
| Context endpoints | No | Always in system prompt; don't embed |
| Schemas, enums | No | Machine metadata, not retrieval material |

## Chunking the library at the paragraph level

The library is the surface where chunking matters most. Each library
chapter is already pre-split into paragraphs in the JSON response, so
the chunking is free:

```python
def library_chunks(book_slug: str):
    """Yield (chunk_id, text, metadata) tuples for a library book."""
    meta = httpx.get(
        f"https://api.wheelofheaven.world/v1/library/books/{book_slug}/"
    ).json()["data"]
    for ch_n in range(1, meta["chapter_count"] + 1):
        ch = httpx.get(
            f"https://api.wheelofheaven.world/v1/library/books/{book_slug}/chapters/{ch_n}"
        ).json()["data"]
        for p in ch["paragraphs"]:
            yield (
                f"{book_slug}:c{ch_n}p{p['n']}",
                p["text"],
                {
                    "book": book_slug,
                    "chapter": ch_n,
                    "paragraph": p["n"],
                    "ref": p["ref"],
                    "reading_url": (
                        f"https://www.wheelofheaven.world/library/{book_slug}/"
                        f"#c{ch_n}p{p['n']}"
                    ),
                },
            )
```

The chunk ID encodes the canonical citation. The metadata carries
everything the model needs to surface a verifiable URL.

## Chunking wiki, articles, timeline

For HTML-bodied surfaces (wiki, articles, timeline), the choice is:

- **Whole-page chunks** for wiki (bodies are short).
- **Section-level chunks** for timeline and articles (bodies are
  long).

Section-level chunking by HTML `<h2>` boundary:

```python
from bs4 import BeautifulSoup

def section_chunks(body_html: str, page_slug: str, kind: str):
    soup = BeautifulSoup(body_html, "html.parser")
    current_section = "intro"
    current_text = []
    for elem in soup.find_all(["h2", "h3", "p", "ul", "ol", "blockquote"]):
        if elem.name == "h2":
            if current_text:
                yield (
                    f"{kind}:{page_slug}:{current_section}",
                    "\n\n".join(current_text),
                    {"kind": kind, "slug": page_slug, "section": current_section},
                )
            current_section = elem.get("id") or elem.get_text().lower().replace(" ", "-")
            current_text = []
        else:
            current_text.append(elem.get_text())
    if current_text:
        yield (
            f"{kind}:{page_slug}:{current_section}",
            "\n\n".join(current_text),
            {"kind": kind, "slug": page_slug, "section": current_section},
        )
```

For wiki entries, just embed the body whole:

```python
def wiki_chunk(slug: str):
    e = httpx.get(
        f"https://api.wheelofheaven.world/v1/wiki/{slug}/"
    ).json()["data"]
    text = strip_html(e["body_html"])
    return (
        f"wiki:{slug}",
        text,
        {
            "kind": "wiki",
            "slug": slug,
            "title": e["title"],
            "summary": e["extra"].get("summary"),
            "claim_type": e["extra"].get("claim_type"),
            "category": e["extra"].get("category"),
            "reading_url": f"https://www.wheelofheaven.world/wiki/{slug}/",
        },
    )
```

## Metadata that matters for retrieval

Attach these fields to every chunk regardless of source surface:

| Field | Why |
|---|---|
| `kind` | `wiki` / `timeline` / `article` / `news` / `library` / `tradition-hub` / `source` |
| `slug` | Canonical identifier |
| `lang` | For multilingual filtering |
| `claim_type` | Lets the model surface `direct` / `inferred` / `speculative` per claim |
| `editorial_pass` | Lets you de-prioritise pre-current-pass content |
| `reading_url` | The human-readable deep link the AI surfaces in answers |
| `api_url` | The canonical JSON URL for re-fetching |
| `category` (wiki) / `tradition` (library) / `event_type` (news) | Faceted filtering |
| `date` (news) / `event_date` (news) / `start_year` (timeline) | Time-aware retrieval |

Source the values from the `extra` table on each page. The schema
endpoints document exactly what's available per kind.

## Walking the API for ingest

To build the full index, walk the listing endpoints:

```python
def walk_corpus():
    """Yield every page across the AI-relevant content surfaces."""
    surfaces = [
        ("wiki", "/v1/wiki/"),
        ("timeline", "/v1/timeline/"),
        ("articles", "/v1/articles/"),
        ("news", "/v1/news/"),
        ("tradition-hubs", "/v1/sources/traditions/"),
    ]
    for kind, path in surfaces:
        listing = httpx.get(
            f"https://api.wheelofheaven.world{path}"
        ).json()["data"]["items"]
        for item in listing:
            page = httpx.get(item["url"]).json()["data"]
            yield kind, page

    # Library is a separate walk — chapters not pages
    books = httpx.get(
        "https://api.wheelofheaven.world/v1/library/books/"
    ).json()["data"]["items"]
    for book in books:
        for ch_n in range(1, book["chapter_count"] + 1):
            ch = httpx.get(
                f"https://api.wheelofheaven.world/v1/library/books/{book['slug']}/chapters/{ch_n}"
            ).json()["data"]
            yield "library", {**book, "chapter": ch}
```

The full corpus is approximately:

- ~111 wiki entries (~80K tokens of body)
- 15 timeline pages (~150K tokens of body)
- ~25 articles (~50K tokens of body)
- ~30+ news dispatches (~30K tokens of body)
- ~100 library books × variable chapters (~2M tokens of body)
- ~67 source records (~50K tokens of metadata)

**Total: ~2.4M tokens of content for embedding.** Comfortably indexable
on any modern embedding model.

## Per-language ingestion

For a multilingual deployment, walk the `/v1/{lang}/...` paths for
each target language:

```python
LANGS = ["en", "de", "fr", "es", "ru", "ja", "zh", "zh-Hant", "ko"]

for lang in LANGS:
    base = f"https://api.wheelofheaven.world/v1/{lang if lang != 'en' else ''}"
    base = base.rstrip("/")
    # … walk surfaces under base
```

Carry `lang` as a metadata field on every chunk and filter at retrieval
time. The English chunks should always be retrievable as fallback,
since translations may lag an editorial pass.

The library tree is mirrored under `/v1/{lang}/library/...` for all 9
languages, but per-paragraph translation coverage is sparse outside the
Raëlian source family and the `-woh` translation books. Two practical
implications for embedding pipelines:

- Check `metadata.fallback` on each chapter response — when `true`,
  the paragraph text is the primary language, not the requested one.
  Decide whether to skip, embed-with-tag, or fold into the English
  index.
- The `paragraph.i18n` map is returned in every chapter response, so
  you can index multiple language variants from a single fetch rather
  than walking the language mirror N times.

## The pre-built client-side search index

For a browser-based agent or a small embedded index, the API publishes
a Fuse.js-compatible search index:

```bash
curl https://api.wheelofheaven.world/v1/search/
```

The index covers wiki, timeline, articles, library, and sources. It's
designed for client-side fuzzy keyword search, not for embedding
retrieval — token-budget wise it sits between "always-in-context"
(~10K tokens) and "remote retrieval" (~50K tokens).

For applications where you can't ship a vector store but want better
than llms-full.txt grounding, the search index is a viable middle
path. Pair it with `/v1/context/*` in the system prompt and use it as
a retrieval shim from the agent's tool layer.

## End-to-end example: a minimal RAG pipeline

```python
import httpx
from sentence_transformers import SentenceTransformer
import chromadb

BASE = "https://api.wheelofheaven.world"
embed = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.Client()
coll = client.create_collection("wheel_of_heaven")

# 1. Bootstrap context (once)
ctx_keys = ["hypothesis", "terminology", "timeline", "sources", "method"]
SYSTEM_CONTEXT = "\n\n---\n\n".join(
    httpx.get(f"{BASE}/v1/context/{k}/").json()["data"]["body"]
    for k in ctx_keys
)

# 2. Ingest wiki
wiki_listing = httpx.get(f"{BASE}/v1/wiki/").json()["data"]["items"]
for item in wiki_listing:
    page = httpx.get(item["url"]).json()["data"]
    text = strip_html(page["body_html"])
    coll.add(
        ids=[f"wiki:{item['slug']}"],
        documents=[text],
        metadatas=[{
            "kind": "wiki",
            "slug": item["slug"],
            "title": page["title"],
            "claim_type": page["extra"].get("claim_type", "unknown"),
            "reading_url": f"https://www.wheelofheaven.world/wiki/{item['slug']}/",
        }],
    )

# 3. Query at runtime
def answer(question: str, k: int = 5) -> str:
    hits = coll.query(query_texts=[question], n_results=k)
    retrieved = "\n\n".join(
        f"[{m['title']}] ({m['claim_type']}) {d}\nSource: {m['reading_url']}"
        for d, m in zip(hits["documents"][0], hits["metadatas"][0])
    )
    prompt = f"""{SYSTEM_CONTEXT}

---

The user asked: {question}

Relevant entries from the corpus:

{retrieved}

---

Answer the question using only the entries above. Cite the reading URL
for any specific claim. Surface the claim type (direct / inferred /
speculative) when relevant.
"""
    return call_llm(prompt)
```

This is the skeleton of a working pipeline. Production additions:
re-ranking (e.g. cross-encoder), claim-type filtering ("only surface
`direct` claims"), per-language routing, citation extraction into a
structured `References` block.

## Cache and freshness for an embedding index

Re-embedding the full corpus is cheap (~$1 of API credit at current
embedding model prices). Re-embedding nightly is over-engineering for
all but the most aggressive deployments.

Recommended schedule:

- **Curated context**: refresh every 24 hours (matches edge TTL).
- **Wiki, timeline, articles**: refresh weekly.
- **News dispatches**: refresh daily (these decay quickly).
- **Library, sources, tradition hubs**: refresh monthly (these are
  stable).

For change detection without re-fetching, the API sitemap exposes
`<lastmod>` per endpoint:

```bash
curl https://api.wheelofheaven.world/sitemap.xml | grep -A1 'lastmod'
```

Compare against your last-ingest timestamp and only re-fetch the
delta.

## When RAG is the wrong answer

For applications where the entire corpus fits in the model's context
window (modern frontier models, ~22K tokens), **just paste
`llms-full.txt`**. RAG adds latency, infrastructure, and per-query
embedding cost. The corpus is small enough that for many use cases
the simpler pattern wins.

Switch to RAG when:

- You need multi-corpus retrieval (the Wheel of Heaven corpus plus
  others).
- You need per-language retrieval at scale.
- You need to filter by metadata (claim type, source family, era).
- The model's context window is the bottleneck and you can't fit
  `llms-full.txt`.
- You want the agent to cite specific paragraphs of specific
  library chapters.

For "what is this project, answer questions about it", `llms-full.txt`
in the system prompt is the simplest and most reliable pattern. RAG
is the right next step when the simpler pattern hits its ceiling.
