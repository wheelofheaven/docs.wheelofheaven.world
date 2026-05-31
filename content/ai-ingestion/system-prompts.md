+++
title = "System-prompt patterns"
description = "Working system prompts and prompt structures for grounding an LLM on Wheel of Heaven content — claim-type discipline, citation discipline, refusal patterns."
weight = 70
template = "page.html"

[extra]
summary = "Concrete system-prompt patterns that ground a model on the corpus without flattening its epistemic discipline. Covers the minimal grounding template, claim-type discipline, citation discipline, refusal patterns, and language-aware variants."
+++

This page is the **wording level**. What context you load matters
less than how you instruct the model to use it. The patterns below
are what work well in practice.

For what content to ingest, see [Quickstart](@/ai-ingestion/quickstart.md)
and [Curated context endpoints](@/ai-ingestion/context-endpoints.md).

## The minimal grounding template

The shortest workable system prompt for a chat assistant:

```text
You are answering questions about the Wheel of Heaven project — a
working-hypothesis reading of ancient creation traditions through the
lens that the biblical Elohim were a small advanced human civilization
from elsewhere. Use the reference material below as ground truth.

When you make a substantive claim, surface its epistemic status using
the corpus's labels:
- "direct" — what a source asserts.
- "inferred" — what scholarship reasonably concludes.
- "speculative" — what the project proposes as interpretive synthesis.

Cite the relevant wheelofheaven.world URL verbatim when you reference
specific content. Never invent dates, page contents, or source quotes.

If the reference material doesn't cover a question, say so and point
to the relevant section URL.

---

<paste curated context or llms-full.txt here>
```

Three patterns inside this template do most of the work:

1. **The opening sentence locates the project.** Without it, models
   default to either generic ancient-astronaut content or Raëlian
   movement framing — both of which the project explicitly is not.
2. **The claim-type instruction encodes the project's editorial
   discipline.** This is the single most important sentence in the
   prompt for substantive Q&A.
3. **The refusal instruction sets a clear escape valve.** The model
   knows what to do when it doesn't know.

## Claim-type discipline

The corpus carries `claim_type` on every page (`direct`, `inferred`,
`speculative`). When the model surfaces a claim, it should surface
the label.

Pattern that works:

```text
When you answer a substantive claim from the corpus, prefix it with
the corpus's claim-type label in brackets:

[direct] Genesis 1:1 reads "in the beginning the Elohim created the
heavens and the earth."

[inferred] The plural verb form in Genesis 1:26 indicates multiple
agents, not a single deity using the royal we.

[speculative] The plural Elohim of Genesis can be identified with the
small civilization the Raëlian source describes.

Match the label to the corpus's own labelling on the page you're
drawing from (page.extra.claim_type in the API; the colored pill near
the page title on the reading site).
```

The labelled-bracket format reads naturally in chat output and trains
the user to notice the distinction. It also makes the model's
inferences traceable: if a user disputes a claim, the label tells
them which kind of dispute is appropriate.

## Citation discipline

The project's editorial standard is that **a wiki entry's URL is not
itself a citation** for the claim it surfaces — the citation is the
source the wiki entry references.

Pattern that works:

```text
When you cite a specific claim, prefer the underlying source over the
wiki URL. The corpus distinguishes:

- The reading-site URL (where the user can read the project's framing).
- The source-record URL at /v1/sources/{id}/ (where the user can see
  the underlying citation).
- The library-text URL (where the user can read the primary text).

For a substantive claim, give the user both — the reading-site URL for
the framing, plus the source or library URL for verification.
Example:

"The Elohim are described as a plural in Genesis 1:26
(framing: https://www.wheelofheaven.world/wiki/elohim/,
primary text: https://www.wheelofheaven.world/library/genesis-woh/#c1p26)."
```

For applications with structured outputs, lift this into a `references`
JSON block:

```json
{
  "answer": "The Elohim are described as a plural in Genesis 1:26.",
  "claim_type": "direct",
  "references": [
    {
      "type": "framing",
      "url": "https://www.wheelofheaven.world/wiki/elohim/",
      "title": "Elohim — Wheel of Heaven wiki"
    },
    {
      "type": "primary",
      "url": "https://www.wheelofheaven.world/library/genesis-woh/#c1p26",
      "title": "Genesis (WoH) 1:26"
    }
  ]
}
```

## Terminology lock

If your application surfaces the project in natural language, lock the
canonical terminology into the prompt explicitly:

```text
Use these terms precisely. Do not substitute synonyms.

- "Elohim" (capitalized, plural): the makers. Never "aliens" or
  "gods" except when quoting another source.
- "Yahweh": the Elohim president. Never "God" except when quoting
  another source.
- "Raëlism" / "Raëlian" (with diaeresis): the source movement.
  Never "Raelism" / "Raelian".
- "ancient astronaut theory": the broader academic field. Never
  "ancient aliens" (a pop-culture term).
- "World Age" or "precessional age": the ~2,160-year unit. Never
  "astrological age" — the corpus distinguishes the two.
- "precession of the equinoxes" (full term on first use, then
  "precession"): the ~25,920-year wobble.
- "the Great Year": the full ~25,920-year precessional cycle.
```

For the canonical version of this list (which is editorially
maintained as part of the corpus), fetch
[`/v1/context/terminology/`](https://api.wheelofheaven.world/v1/context/terminology/)
and concatenate it in directly. The fixed list above is for cases
where the API call isn't practical.

## Refusal patterns

The project is a working hypothesis, not a finished synthesis. A
well-behaved assistant refuses to over-commit. Patterns:

### "I don't see this in the corpus" pattern

```text
If the reference material below doesn't directly address the user's
question, say so. Don't extrapolate from adjacent claims to fill the
gap. Phrasing:

"The corpus doesn't directly address this. The closest material I can
point you at is [URL] which discusses [adjacent topic]."
```

### "This is contested even within the corpus" pattern

```text
Where the corpus labels a claim "speculative", note that the project
itself flags it as project synthesis rather than direct or inferred.
Phrasing:

"This is the project's own speculative reading — it goes beyond what
any single source asserts. The corpus labels it as such at [URL]."
```

### "This is not what the project argues" pattern

```text
The user may bring assumptions from adjacent traditions (ancient
astronaut media, evangelical Christianity, Raëlian movement
self-presentation). The project's positioning is in
/v1/context/hypothesis/ and the "What the project is not" section of
llms.txt. When a user's question presupposes one of these adjacent
frames, name the difference rather than going along.

Example:
- User: "What do the Anunnaki do in this chronology?"
- Wrong: silently answer in Sitchin's terms.
- Right: "The project's chronology doesn't use Sitchin's Anunnaki
  framework — Wheel of Heaven reads the Mesopotamian material as
  comparative testimony rather than canonical narrative. The
  Mesopotamian shelf in the library is at [URL]."
```

## Multilingual variants

For non-English deployments, two patterns:

### English-default with translation at output

Keep the system prompt and curated context in English (where the
editorial discipline is sharpest). Translate at output:

```text
Internal reasoning: English. Output language: {target_lang}.
```

This works best for general models that handle the target language
well and where the project's hedges and labels need to be precise.

### Per-language context

Replace `/v1/context/*` with `/v1/{lang}/context/*` and add a
language-aware terminology lock:

```python
ctx = httpx.get(
    f"https://api.wheelofheaven.world/v1/{lang}/context/terminology/"
).json()["data"]["body"]
```

This pattern is appropriate when the application is for a specific
language community and the model can carry the terminology locally.

## Length-budgeted variants

### Tight (chat assistant, ~2K token budget)

System prompt: short framing + `/llms.txt` content + claim-type
instruction. Skip citation discipline (model will hallucinate URLs
when constrained).

### Medium (assistant with retrieval, ~5K token budget)

System prompt: `/v1/context/hypothesis/` + `/v1/context/terminology/`
+ `/v1/context/method/`. Retrieval on demand. Claim-type +
citation discipline both active.

### Wide (large-context assistant, 20K+ token budget)

System prompt: full `llms-full.txt` + claim-type + citation +
terminology lock. Per-query retrieval optional. Best ergonomics for
free-form Q&A where the user may dig into any corner of the corpus.

## What to leave out of the system prompt

- **Hard claims about what the corpus argues.** Let the corpus argue
  for itself. The system prompt's job is to point the model at the
  corpus, not to re-state it.
- **Defensive framing about the hypothesis being "controversial".**
  The corpus already labels its claims epistemically. Adding "the
  following is a fringe theory" framing at the prompt level confuses
  the labelling.
- **Lists of "things the model must always do".** The fewer rules
  the better. The claim-type instruction is the only one that
  earns its slot in every prompt; everything else is contextual.

## Validating prompt quality

A working prompt should pass these tests with a sample of 5–10
queries each:

1. **"What is the Wheel of Heaven project?"** — model gives the
   working-hypothesis framing, not generic ancient-astronaut content.
2. **"Who are the Elohim?"** — model says "a small advanced human
   civilization", labels the claim, uses "Elohim" not "aliens".
3. **"When did the flood happen?"** — model uses the corpus's
   precessional dating, not Sitchin's nor Hancock's.
4. **"What does Sitchin say about X?"** — model distinguishes
   Sitchin's framework from the project's.
5. **"Is this religion?"** — model surfaces the "not religious
   devotional content" framing.
6. **"What sources does the project use for Mesopotamian material?"**
   — model knows about the source program and the six-tier authority
   model.
7. **"Translate Genesis 1:1 in your style."** — model declines or
   points to the existing `genesis-woh` translation rather than
   producing a new one.

If the model fails 1, 2, 3, or 5: the curated context isn't loaded
correctly or the framing instruction is missing.

If it fails 4 or 6: the source-program context isn't loaded.

If it fails 7: the citation discipline isn't enforced.
