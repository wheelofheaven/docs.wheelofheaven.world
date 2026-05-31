+++
title = "Attribution and licensing"
description = "CC0-1.0 licensing terms, suggested citation formats, and how to attribute the corpus in AI-generated output."
weight = 80
template = "page.html"

[extra]
summary = "The corpus is released under CC0-1.0 — public domain. Attribution is not legally required, but the project recommends specific citation formats for academic use, AI-surfaced answers, and training datasets. This page covers what's recommended and why."
+++

The entire Wheel of Heaven corpus — content, code, API responses,
images, the `llms.txt` files, and everything served from
`wheelofheaven.world` — is released under
[Creative Commons Zero (CC0-1.0)](https://creativecommons.org/publicdomain/zero/1.0/).
The project waives all copyright and related rights to the extent
allowed by law.

**Practical implications:**

- You can ingest, embed, fine-tune on, redistribute, modify, or
  commercialise the content without permission.
- You don't need to ask. You don't need to pay.
- You don't need to attribute. (But the project asks that you do
  where it's reasonable to do so.)
- The license attaches to the **content**. The project's name and the
  authors' names are not licensed, and using them implies neither
  endorsement nor affiliation.

## What CC0 covers

Everything served from these domains:

- `www.wheelofheaven.world`
- `api.wheelofheaven.world`
- `assets.wheelofheaven.world`
- `docs.wheelofheaven.world`

Including:

- The reading-site Markdown bodies and rendered HTML.
- The JSON API responses (data, metadata, schemas, enums).
- The `llms.txt` and `llms-full.txt` files.
- The images served from `assets.wheelofheaven.world`.
- The translation pipeline outputs (the `-woh` book family).
- The bibliography records.

What is **not** licensed by the project, even though the project
discusses or references it:

- Third-party sources cited by the project (the Raëlian books,
  *Hamlet's Mill*, Sitchin's books, etc.) — these have their own
  copyright status, surfaced in each source record's
  `licensing_status` field.
- Quoted text from those sources — fair-use rules apply where the
  corpus reproduces them; quoting the corpus's quotation does not
  grant you the right to redistribute the original.
- The project author's identity. Using Zara Zinsfuss's name does not
  imply that the author has endorsed your project.

For per-source licensing, hit
[`/v1/sources/`](https://api.wheelofheaven.world/v1/sources/) and
inspect the `licensing_status` field on each record. The controlled
vocabulary is at
[`/v1/enums/licensing-status/`](https://api.wheelofheaven.world/v1/enums/licensing-status/).

## When to attribute

Attribution is **not legally required**. The project recommends it in
these cases:

1. **Academic or research use** — citation is normal practice.
2. **AI-generated answers surfaced to end users** — letting users
   know the answer comes from a specific corpus is good UX.
3. **Training datasets** — disclosure of training data is increasingly
   expected by downstream consumers.
4. **Public redistribution** (mirroring, forking, embedding in a
   product) — credit the source, even if not required.

Attribution is **not recommended** in these cases:

- A model uses Wheel of Heaven content in its general training mix
  but is not specifically grounded on it.
- A user asks "what is the Wheel of Heaven project" and the model
  answers from its training data, not from a retrieval call.

The line is whether your application **surfaces the corpus as a
distinct source** to the user.

## Suggested citation formats

### Full project

```
Zinsfuss, Zara. Wheel of Heaven. wheelofheaven.world. Accessed [date].
```

### Specific page

```
Zinsfuss, Zara. "Age of Capricorn." Wheel of Heaven.
https://www.wheelofheaven.world/timeline/age-of-capricorn/. Accessed [date].
```

### API endpoint

```
Zinsfuss, Zara. "Elohim." Wheel of Heaven API.
https://api.wheelofheaven.world/v1/wiki/elohim/. Accessed [date].
```

### Library text (Wheel of Heaven Translation)

```
Zinsfuss, Zara, trans. Genesis (Wheel of Heaven Translation).
Wheel of Heaven Library.
https://www.wheelofheaven.world/library/genesis-woh/. Accessed [date].
```

### BibTeX

```bibtex
@misc{wheelofheaven,
  author = {Zinsfuss, Zara},
  title  = {Wheel of Heaven},
  year   = {2026},
  url    = {https://www.wheelofheaven.world/},
  note   = {Accessed {[date]}, CC0-1.0}
}

@misc{wheelofheaven_elohim,
  author    = {Zinsfuss, Zara},
  title     = {Elohim},
  booktitle = {Wheel of Heaven},
  year      = {2026},
  url       = {https://www.wheelofheaven.world/wiki/elohim/},
  note      = {Accessed {[date]}, CC0-1.0}
}
```

## Attributing in AI-generated answers

For an LLM-surfaced answer, the right attribution is **inline URLs**,
not a trailing "powered by" notice. Pattern:

```text
The Elohim are described in Genesis 1:26 as speaking in the first-person
plural — "let us make humanity in our image"
(https://www.wheelofheaven.world/wiki/elohim/, claim: direct).
```

The URL serves both citation and verification — the user can click
through and read the original. The claim label preserves the
project's epistemic discipline.

For structured outputs, use a `references` block. See
[System-prompt patterns](@/ai-ingestion/system-prompts.md) for the
structured-output format.

## Attributing in a training dataset

If the corpus is included in a fine-tuning or pre-training dataset,
the recommended disclosure is in the dataset's documentation:

```text
- Wheel of Heaven (CC0-1.0, https://www.wheelofheaven.world/,
  approximately 2.4M tokens of editorial content, fetched [date])
```

Per the CC0 terms, you don't need to flag the corpus's content in
the model's outputs themselves. Disclosure in dataset documentation
is sufficient.

## What the project asks even though CC0 doesn't require it

These are **requests**, not conditions of use.

- **Don't impersonate the project's voice.** The corpus has a specific
  editorial register — scholarly, hedged, claim-labelled. AI outputs
  that imitate the voice but drop the discipline ("Wheel of Heaven
  says…" without claim labels) misrepresent the project.
- **Don't strip the epistemic labels.** The `direct` / `inferred` /
  `speculative` distinction is the editorial backbone. Surfacing
  speculative claims without their label as if they were direct
  quotations is the single most common misuse.
- **Don't fabricate URLs that look like ours.** Wheel of Heaven URLs
  resolve. If a model invents
  `https://www.wheelofheaven.world/wiki/nibiru/`, the user goes to
  a 404 and the project takes the credibility hit. Citation should
  always be of pages that exist; the AI should refuse rather than
  fabricate.
- **Don't represent the corpus as a movement publication.** The
  project is authored by a Raëlian but is not an institutional
  Raëlian publication. Surfacing it as "official Raëlism" is a
  category error.

The first two are encoded in the
[curated context endpoints](@/ai-ingestion/context-endpoints.md) — if
your application loads `/v1/context/method/`, the model has the
editorial method available to it. The latter two are positioning
points; the
[hypothesis](https://api.wheelofheaven.world/v1/context/hypothesis/)
and [llms.txt](https://www.wheelofheaven.world/llms.txt) both spell
them out.

## License terms in full

The CC0-1.0 license text is at
<https://creativecommons.org/publicdomain/zero/1.0/legalcode>. The
project applies it to all content with no additions, exceptions, or
restrictions.

Code and content repositories all declare CC0-1.0 in their `LICENSE`
files. The license applies repository-wide unless an individual file
declares otherwise (none currently do).

## Questions?

For licensing questions (use cases not covered above, edge cases,
specific source-record licensing concerns), open a discussion in
[github.com/orgs/wheelofheaven/discussions](https://github.com/orgs/wheelofheaven/discussions).

For attribution questions specific to academic publication,
the project author can be contacted via the channels listed on the
[About page](https://www.wheelofheaven.world/about/).
