+++
title = "Library and sources"
description = "How to ingest the primary texts (library books at chapter and verse) and the bibliographic backbone (sources, tradition hubs) for AI use."
weight = 50
template = "page.html"

[extra]
summary = "The library is the corpus's primary-text shelf — ~100 books at chapter and verse granularity. The sources endpoint is the bibliographic backbone — 67 structured records with authority tier, source family, and stance. Together they let an AI surface citations the project itself would endorse."
+++

The project distinguishes between **primary texts** (the actual books
the corpus reads) and **bibliographic records** (the structured
metadata about who said what, when, with what authority). Both are
first-class API surfaces.

## The library — primary texts at chapter and verse

The library houses ~100 books, structured at chapter and verse
granularity. It is the project's deepest data surface — the place
where AI ingestion can do something the reading site can't easily do
itself.

### Discovery

```bash
curl https://api.wheelofheaven.world/v1/library/
curl https://api.wheelofheaven.world/v1/library/books/
curl https://api.wheelofheaven.world/v1/library/traditions/
```

The overview gives totals. The books list gives every book with slug,
code, tradition, chapter count, paragraph count, and status. The
traditions list gives the shelves (raelian, biblical, mesopotamian,
vedic, mesoamerican, ...).

### Book metadata

```bash
curl https://api.wheelofheaven.world/v1/library/books/the-book-which-tells-the-truth/
```

Returns a `Book` payload with full metadata (author, original title,
year, language) and a chapter index. Use the lightweight variant for
just-the-metadata calls:

```bash
curl https://api.wheelofheaven.world/v1/library/books/the-book-which-tells-the-truth/meta
```

### Chapter content

This is where the value is. Each chapter is a separate endpoint:

```bash
curl https://api.wheelofheaven.world/v1/library/books/genesis-woh/chapters/1
```

Returns a `Chapter` payload:

```json
{
  "apiVersion": "v1",
  "kind": "Chapter",
  "metadata": { "book": "genesis-woh", "chapter": 1, "lang": "en" },
  "data": {
    "title": "Chapter 1",
    "paragraphs": [
      {
        "n": 1,
        "ref": "c1p1",
        "text": "When the Elohim began to shape the skies and the land…",
        "refIds": ["bereshit-1-1"]
      },
      …
    ]
  },
  "links": { "self": "/v1/library/books/genesis-woh/chapters/1", … }
}
```

Each paragraph carries:

- `n` — sequential paragraph number within the chapter.
- `ref` — the canonical deep-link anchor (`c{chapter}p{paragraph}`),
  matching the reading-site `#c1p1` anchor.
- `text` — the paragraph body.
- `refIds` — cross-references to other texts, e.g. the verse-level
  alignment in the source tradition.

### The `-woh` book family — Wheel of Heaven Translations

A subset of library books are **project-internal re-translations** of
source texts, marked with the `-woh` suffix (e.g. `genesis-woh`,
`atrahasis-woh`). These are not editions of existing translations; they
are the project's own readings, produced through a documented
translator → editor → reviewer pipeline.

Each WoH Translation has full provenance available at
`/v1/translations/{slug}/`:

```bash
curl https://api.wheelofheaven.world/v1/translations/genesis-woh/
```

Returns the source text identifier, the glossary version used, the
translator/editor/reviewer model versions, the human reviewer, and a
list of editorial divergences from received translations.

**Always pair a WoH Translation quotation with its provenance** when
surfacing it in an AI-generated answer. The project's editorial
discipline is in the provenance, not just the text.

### Multilingual library access

The library tree is mirrored under `/v1/{lang}/library/...` for all 9
supported languages (de, fr, es, ru, ja, zh, zh-Hant, ko, he), with
English the unprefixed default:

```bash
curl https://api.wheelofheaven.world/v1/de/library/books/the-book-which-tells-the-truth/chapters/1
curl https://api.wheelofheaven.world/v1/ja/library/books/the-book-which-tells-the-truth/chapters/1
```

Behaviour:

- **Catalog metadata** — `title`, tradition `name` and `description`
  resolve from the requested language with English fallback. The raw
  `titles` / `names` / `descriptions` maps are also returned so a
  client can switch language without a refetch.
- **Chapter titles** — pulled from `chapter.i18n.{lang}` with English
  fallback to `chapter.title` (primary-language).
- **Paragraph text** — pulled from `paragraph.i18n.{lang}` with
  fallback to `paragraph.text` (primary-language).
- **`metadata.fallback`** — set to `true` on `Book` and `BookMeta`
  responses when the requested language is not in the book's
  `completeLangs`. Lets a client warn the user that they're getting
  the primary-language text.
- **`paragraph.i18n`** — the full per-paragraph language map is
  preserved in the chapter response, so clients can language-switch
  in-flight without re-fetching.

Coverage is sparse outside the Raëlian source family and the `-woh`
translation books — biblical and ancient-text books typically have
`completeLangs: ["en"]` only, so non-English requests return the
English text with `fallback=true`.

### Useful retrieval patterns

**Quote a passage by reference:**

```python
def quote(book: str, chapter: int, paragraph: int) -> str:
    ch = httpx.get(
        f"https://api.wheelofheaven.world/v1/library/books/{book}/chapters/{chapter}"
    ).json()["data"]
    p = next(p for p in ch["paragraphs"] if p["n"] == paragraph)
    return p["text"]
```

**Build a per-book index:**

```python
def book_index(slug: str) -> list[tuple[int, int, str]]:
    meta = httpx.get(
        f"https://api.wheelofheaven.world/v1/library/books/{slug}/"
    ).json()["data"]
    rows = []
    for ch_n in range(1, meta["chapter_count"] + 1):
        ch = httpx.get(
            f"https://api.wheelofheaven.world/v1/library/books/{slug}/chapters/{ch_n}"
        ).json()["data"]
        for p in ch["paragraphs"]:
            rows.append((ch_n, p["n"], p["text"]))
    return rows
```

**Link an AI answer back to the human-readable reading-site URL:**

The reading site uses the same `c{chapter}p{paragraph}` anchor format,
so once you have a citation you can construct the deep link:

```python
def reading_url(book: str, chapter: int, paragraph: int) -> str:
    return (
        f"https://www.wheelofheaven.world/library/{book}/"
        f"#c{chapter}p{paragraph}"
    )
```

## The bibliography — sources

The sources endpoint exposes the **bibliographic backbone** — 67
structured records of every cited work in the corpus.

```bash
curl https://api.wheelofheaven.world/v1/sources/
curl https://api.wheelofheaven.world/v1/sources/raelism-the-book-which-tells-the-truth/
```

Each `Source` record carries:

- `id` — slug.
- `title`, `subtitle`, `author`, `year_published`.
- `source_family` — `raelian`, `biblical`, `mesopotamian`, `vedic`,
  `mesoamerican`, `scholarly`, `scientific`, `critical`, etc.
- `authority_tier` — `0` through `5`, mapping to the six-tier
  authority model.
- `relation_to_wheel` — `primary`, `comparative`, `scholarly_support`,
  `scientific_context`, `critical_engagement`, etc.
- `stance` — `affirms`, `agnostic`, `partial`, `critical`, `opposes`.
- `licensing_status` — copyright status of the source.
- `library_slug` — cross-link to the full text under
  `/v1/library/books/`, if available.

For the controlled vocabularies, see:

```bash
curl https://api.wheelofheaven.world/v1/enums/authority-tier/
curl https://api.wheelofheaven.world/v1/enums/source-family/
curl https://api.wheelofheaven.world/v1/enums/relation-to-wheel/
curl https://api.wheelofheaven.world/v1/enums/stance/
```

For the full schema:

```bash
curl https://api.wheelofheaven.world/v1/schema/source/
```

### Tradition hubs

The bibliography also exposes **tradition hubs** — per-tradition
landing pages explaining why a tradition is included and where it
converges with or diverges from the canon.

```bash
curl https://api.wheelofheaven.world/v1/sources/traditions/
curl https://api.wheelofheaven.world/v1/sources/traditions/mesopotamian/
```

A tradition hub is the right place to look when you want to ground
an LLM on "what does the project think about the Mesopotamian creation
material" — it's the editorial framing, not just the bibliography.

### Why this matters for AI use

When an AI surfaces a claim from the corpus, **the right citation is
not the URL it found the claim on, but the source the corpus itself
cites for that claim**. The pattern:

1. AI retrieves the wiki entry / timeline page / article body.
2. AI extracts the claim it wants to surface.
3. AI looks up the corresponding `references` entries on the page.
4. AI resolves those to `Source` records.
5. AI surfaces the answer with the **source citation**, not just the
   wiki URL.

This pattern keeps AI-generated answers aligned with the project's
own bibliographic discipline. Without it, the AI ends up citing the
wiki entry as if the wiki entry were the source — which the project's
editorial standards explicitly reject.

## Concept hubs

A third small surface, currently sparse but worth knowing about:

```bash
curl https://api.wheelofheaven.world/v1/concepts/
```

Concept hubs are per-concept landing pages (analogous to tradition
hubs, but for cross-cutting ideas — "the deluge tradition", "the
twelve-fold structure", etc.). The surface exists; population is
rolling out per Decision 13 of the project strategy. Check before
relying on it.

## Putting it together — a research-assistant retrieval flow

```python
import httpx
BASE = "https://api.wheelofheaven.world"

def grounded_answer(question: str, wiki_slugs: list[str]) -> dict:
    """For a list of relevant wiki entries, retrieve the entries,
    pull the source records they reference, and return both for
    LLM consumption."""
    entries = []
    source_ids = set()
    for slug in wiki_slugs:
        e = httpx.get(f"{BASE}/v1/wiki/{slug}/").json()["data"]
        entries.append(e)
        for ref in e["extra"].get("references", []):
            if "source_id" in ref:
                source_ids.add(ref["source_id"])
    sources = [
        httpx.get(f"{BASE}/v1/sources/{sid}/").json()["data"]
        for sid in source_ids
    ]
    return {"entries": entries, "sources": sources}
```

The LLM then has both the bodies (for content) and the source records
(for citation). The pattern scales to timeline pages and articles
identically — both expose `references` in `extra`.
