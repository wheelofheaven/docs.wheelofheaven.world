+++
title = "Genesis Lenses (Reading and Meaning)"
description = "How the Reading and Meaning lenses of the /genesis/ reader are written: data model, canon-first labelling rules, Writer to Editor to Reviewer to founder sign-off, validator, publishing."
template = "page.html"
weight = 57
+++

The [Genesis reader](https://www.wheelofheaven.world/genesis/) shows every
verse in four lenses. Lenses 1–2 (Hebrew and the literal translation) come
from the finished [Genesis-WoH](https://www.wheelofheaven.world/library/genesis-woh/)
translation, with all 50 chapters `stable`. This page covers the work that
produces **lenses 3 and 4**:

- **Reading (layer 3):** the passage retold in plain sentences as the Messages
  understand it. It follows meaning rather than wording, and quotes *The Book
  Which Tells the Truth* where the book speaks.
- **Meaning (layer 4):** a short explanation of each passage in modern
  language, for a reader who has never opened Genesis.

For how the reader renders this data (slider, claim dots, canon chips, draft
gating), see the component page:
[Genesis four-lens reader](@/components/interactive/genesis-reader.md).

## Scope and order

- Layers 3–4 are written for the primeval history, Genesis 1–11, first, in
  waves: Genesis 1, then A (2–3), B (4–5), C (6–9) and D (10–11). In Genesis
  12–50 the canon speaks only to 18:20–21, 19, 22, 28 and 35.
- English only for now.
- Genesis 1–3 are `stable` (1.0.0, signed off 2026-11-27). They are live.
- A chapter is published only after the founder signs it off. Until then its
  lens file renders on the local dev server only.

## Data model

Everything lives in `data-library/genesis-woh/lenses/`. **Layer-2 files
(`genesis-woh/chapter-N.json`) are never edited from the lens track.** The
lens folder's
[`README.md`](https://github.com/wheelofheaven/data-library/blob/main/genesis-woh/lenses/README.md)
and `schema.json` are the authoritative specification. This section
summarises them.

| File | Purpose |
|---|---|
| `_lenses.json` | Index: `schemaVersion`, `canonMapVersion`, one row per lens chapter (`chapter`, `file`, `status`, `version`, `signedOffBy`, `signedOffAt`, each copied from the chapter file). It is deliberately not named `_meta.json`. |
| `canon-map.json` | Every verse of Genesis 1–50 mapped exactly once to the canon paragraphs that quote, comment on or allude to it |
| `schema.json` | JSON Schema (draft 2020-12) for `chapter-N.json` |
| `chapter-N.json` | Layers 3–4 for chapter N |
| `chapter-N-editor-report.md`, `chapter-N-signoff-package.md` | The chapter's audit trail |

### canon-map.json

```json
{
  "version": "1.1.0",
  "bookSlug": "genesis-woh",
  "standingRules": [{ "book": "TBWTT", "speaker": "Yahweh", "standing": "canon" }],
  "entries": [
    {
      "range": ["1:1", "1:1"],
      "relation": "quotes",
      "refs": [
        { "ref": "TBWTT-2:4", "relation": "quotes", "standing": "canon" },
        { "ref": "TBWTT-2:5", "relation": "comments", "standing": "canon" }
      ]
    }
  ]
}
```

- **`range`** is inclusive and may cross chapters, which keeps long silent
  stretches to one entry.
- **`refs[].ref`** is the canon paragraph `refId` exactly as it appears in the
  book's chapter files (`TBWTT-2:4`, `ETTMTTP-2:104`, `LWTE-1:69`).
- **`refs[].relation`** is one of:
  - `quotes`: the paragraph quotes this Genesis text;
  - `comments`: it explains the quoted passage;
  - `alludes`: it refers to the episode without quoting it;
  - `opinion`: used for author-opinion refs only.
- **`refs[].standing`** is derived from `standingRules` (see the next section).
  The optional `flags: ["sensitive"]` marks passages that need editorial
  review before use, such as the ETTMTTP descent passages 2:104 and 2:123.
- **Entry `relation`** is the strongest canon-standing relation (`quotes` >
  `comments` > `alludes`). It is `opinion` if the entry has only author-opinion
  refs, `check` if it has only unconfirmed refs, and `silent` if it has no refs.

When the map changes, bump its `version`, then bump `canonMapVersion` in every
lens file and in `_lenses.json`.

### chapter-N.json

```json
{
  "schemaVersion": 1, "bookSlug": "genesis-woh", "chapter": 1,
  "basedOn": { "translationVersion": "1.1.0", "layer2Digest": "sha256:…", "canonMapVersion": "1.1.0" },
  "lens": { "track": "lens", "version": "0.1.0", "status": "draft",
            "modelDrafts": [], "reviewerReport": {},
            "signedOffBy": null, "signedOffAt": null,
            "coreClaims": { "woh-claim-0009": "0.2.0" } },
  "passages": [ {
    "id": "gen-1-day-1", "range": ["1:1", "1:5"],
    "title": { "en": "The First Day: Finding the Planet" },
    "canonCoverage": "quotes",
    "readings": [ { "refs": ["1:1"], "text": { "en": "…" },
                    "basis": "canon", "claim": "framework",
                    "canon": ["TBWTT-2:4", "TBWTT-2:5"], "coreClaim": "woh-claim-0001" } ],
    "explanation": {
      "paragraphs": [ [ { "text": { "en": "…" }, "claim": "direct", "coreClaim": "woh-claim-0009" },
                        { "text": { "en": "…" }, "claim": "framework", "canon": ["TBWTT-2:2", "TBWTT-2:5"] } ] ],
      "visual": { "kind": "diagram", "ref": "creation-week", "alt": { "en": "…" } }
    }
  } ]
}
```

- **`basedOn`** pins the layer-2 version, its digest and the canon-map version
  the lens was written against. To get the digest, run
  `validate_genesis_lenses.py --digest N`. A digest mismatch means layer 2
  changed after the lens was written. It is a warning for `draft` and
  `editor-review`, and an error from `reviewer-approved` on.
- **`passages[]`** are contiguous verse ranges that do not overlap and cover
  the chapter. `canonCoverage` is the strongest canon relation over the
  passage's verses (`quotes | comments | alludes | silent`). Map relations
  `opinion` and `check` count as `silent`, so the reader shows the "Messages do
  not comment" marker for them.
- **`readings[]`** (layer 3) must cover every verse of the chapter exactly
  once and stay inside their passage. A reading's `refs` are `"C:V"` or
  `"C:V-W"`. A multi-verse reading becomes one card in the reader.
  - `basis` is `canon` (the reader shows "From the Messages") or `synthesis`
    ("A Wheel of Heaven reading").
  - `claim` is `direct | framework | inferred | speculative`.
  - `canon` lists the refs the reading rests on. `coreClaim` is optional.
- **`explanation.paragraphs[][]`** (layer 4) are paragraphs made of
  claim-labelled segments. Each segment can carry `canon` and `coreClaim`.
  `visual` is optional and must name a diagram that exists in Bifrost's
  `static/diagrams/`.
- **Canon refs** are plain strings (`"TBWTT-2:4"`) only when their standing is
  `canon`. Every other standing is written out, for example
  `{"ref": "LWTE-1:69", "standing": "author-opinion"}`. The reader renders
  these as dashed "opinion" chips.
- **Text** is markdown rendered inline. Use `*italics*` for transliterated
  Hebrew.

## Canon-first labelling rules

These are founder rulings and they bind every lens chapter.

### What counts as canon

The canon is **the dictated Messages only** (ADR 0018):

| Standing | Source | Use |
|---|---|---|
| `canon` | Paragraphs dictated in *The Book Which Tells the Truth* (TBWTT) and in chapter 2 of *Extraterrestrials Took Me to Their Planet* (ETTMTTP) | May ground a `framework` claim |
| `narration` | The author's narration around the dictation | Not canon. Cite the dictated paragraph instead. Never in the map. |
| `check` | Reserved for paragraphs whose dictation status is unconfirmed | Not canon until the founder rules |
| `author-opinion` | *Let's Welcome the Extraterrestrials* (LWTE); ETTMTTP chapter 3, "The Keys", which is author-written and not dictated | Always cited with this label. **Never the sole basis of a `framework` claim.** |

### How to write

1. **Follow the canon where it speaks.** Layer 4 follows TBWTT wherever it
   comments on the passage, and cites the paragraph (chapter:paragraph). Where
   TBWTT speaks, layer 3 uses its own words.
2. **Mark silence plainly.** A passage the canon does not touch gets
   `canonCoverage: "silent"`. The reader then prints "The Messages do not
   comment on this passage; what follows is a Wheel of Heaven reading."
   before the explanation. Every segment after it carries an honest label,
   usually `inferred` or `speculative`.
3. **Layer 3 is in the third person.** Write "The Elohim began to shape…",
   not "We…". It retells the meaning and does not shadow the literal wording,
   because lens 2 already gives the reader the words.
4. **Name the creators.** In layers 3–4, YHWH-Elohim is rendered **"the
   creators"**. Layer 2 keeps "YHWH-Elohim".
5. **Put the canon figure first.** For example, TBWTT 2:10 gives a creation
   "day" as about 2,000 Earth years. The Wheel of Heaven model's ≈ 2,160 years
   (claim 0059) comes second and is labelled `framework`. The creation-week
   diagram is drawn in the same order.
6. **Never present canon content as what the Hebrew says.** Keep philology
   (`direct`, about the text) apart from the canon reading (`framework`). When
   a canon link is the project's own pairing of a verse with a paragraph,
   label it `inferred`. Never imply that the creators wrote Genesis.
7. **Keep claims in their place.** Some claim records have a ruled single
   location. For example, the TBWTT 2:43 election statement (claim 0076) is
   quoted **once**, at Genesis 3:22, in 0076's scope wording, labelled
   `framework`, and not in Genesis 2. The day-3 Flood dating is `speculative`.
8. **Use ETTMTTP 2:104 and 2:123 only after editorial review.** These descent
   passages are flagged `sensitive`.

Labels follow the decision tree in `.claude/rules/content.md` (*Claim Type*).
In short:

- `direct`: in the text and uncontroversial;
- `framework`: explicit in the canon but not mainstream;
- `inferred`: a reasonable reading;
- `speculative`: a synthesis beyond any single source.

Prefer a `coreClaim` whenever a core record controls the label, and pin it in
`lens.coreClaims`. The prose rules from
[Grounded Production](@/contributing/content/grounded-production.md) and the
house style also apply. Cut AI idioms such as the "not X but Y" tic. State
canon claims directly, and hedge only comparative and scientific layers.

## Pipeline: Writer → Editor → Reviewer → founder

The roles mirror the
[Source-Text Translation](@/contributing/content/source-text-translation/roles.md)
pipeline. Each role writes to the lens file and leaves an audit trail. Each
status step bumps `lens.version` and updates the chapter's row in
`_lenses.json`.

| Step | Role | Status after | What it does |
|---|---|---|---|
| 1 | **Writer** | `draft` (0.1.0) | Reads the layer-2 chapter, the canon-map entries for its verses and every cited canon paragraph. Sets the passage boundaries, then drafts layers 3–4 under the rules above. Fills `basedOn` (using `--digest N`) and `coreClaims`, and adds itself to `modelDrafts`. |
| 2 | **Editor** | `editor-review` (0.2.0) | Re-checks every attribution against the canon paragraph, in both the French original and the project English. Matches every quotation verbatim against the canon and layer-2 English, and re-checks labels against the decision tree and the pinned core records. Fixes wording, splits segments that mix labels and drops claims that are out of place. Writes `chapter-N-editor-report.md`: method, every change with its reason, and flags for the founder. |
| 3 | **Reviewer** | `reviewer-approved` | Comes to the chapter fresh and forms initial verdicts *before* opening the editor report. Re-derives every canon citation and checks every Hebrew claim against the pointed text. Records `lens.reviewerReport`: `reviewer`, `reviewedAt`, `reviewedVersion`, `method`, `counts`, and `verdicts[]` per passage and per unit (`approve`, `revise` or `flag-for-human`, with citations and reasoning). |
| 4 | Orchestrator | `awaiting-human` | Applies the agreed revisions, gets the validator clean, and writes `chapter-N-signoff-package.md`: a summary, the open flags as decisions with a recommended option, and a link to the chapter on the dev server. |
| 5 | **Founder** | `stable` (1.0.0) | Reviews the package and the rendered chapter on the local dev server. "sign-off ok" ratifies the package. The orchestrator then sets `status: "stable"`, `version: "1.0.0"`, `signedOffBy` (the founder's handle) and `signedOffAt`, and updates the `_lenses.json` row. Rulings that bind later chapters go into this page and the lens README. |

Founder sign-off is per chapter or per wave. Nothing is committed to `main`
or pushed before it. A chapter that has not been signed off may be committed
at a pre-stable status, because the production site renders only `stable`
lens files.

## Validator

`data-library/scripts/validate_genesis_lenses.py` uses the standard library
only. Run it from the data-library root:

```sh
python3 scripts/validate_genesis_lenses.py --core-catalog ../core/model/catalog.json
python3 scripts/validate_genesis_lenses.py --staged     # before every lens commit
python3 scripts/validate_genesis_lenses.py --digest 1   # print the layer-2 digest for basedOn
python3 -m unittest discover -s scripts -p 'test_validate_genesis_lenses.py'
```

The catalog path can also be given through `WOH_CORE_CATALOG`. Warnings are
printed but do not fail the run. Any error exits 1. It checks:

1. **Canon map:**
   - semver `version`;
   - every Genesis 1–50 verse covered exactly once;
   - every ref exists in the canon chapter files, with the standing its
     `standingRules` give;
   - author-opinion refs use `opinion` and nothing else does;
   - no narration refs;
   - entry relations consistent with their refs.
2. **Lens file header:**
   - `schemaVersion`, `bookSlug` and the chapter number match the file name;
   - `translationVersion` and `canonMapVersion` are current;
   - the digest matches.
3. **Coverage:** passages and readings each cover every verse once, and
   readings stay inside their passage.
4. **`canonCoverage`** equals the canon-map value for the passage's verses.
5. **Canon refs:** every ref exists, non-canon standings are written out, and
   LWTE refs carry `author-opinion`.
6. **`framework` grounding:** a `framework` reading or segment needs a
   canon-standing ref or a `coreClaim`. It cannot rest on author-opinion or
   `check` refs alone.
7. **`basis: "canon"`:** the reading cites a canon-standing ref that the map
   attaches to one of its verses.
8. **Core claims:** every `coreClaim` is listed in `lens.coreClaims` and exists
   in the core catalog. Version drift is a warning.
9. **Sign-off:** `stable` requires `signedOffBy` and `signedOffAt`.
10. **`_lenses.json`:** rows match their lens files, and every lens file is
    listed.
11. **`--staged`:** fails if any `genesis-woh/chapter-*.json` (layer 2) is
    staged. Lens commits never touch layer 2.

## Preview, regenerate stubs, publish

Three repos are involved:

- `data-library`, which holds the lens data;
- `data-content`, which holds the `content/genesis/` stubs;
- the www repo, which pins both as submodules (`data/library` and `content`).

Commit each submodule before its parent pointer, and always commit by explicit
path. The workspace usually carries unrelated work in progress.

**1. Preview on the dev server.** In the www repo, bring `data/library` to the
lens commit and run `mise run dev-lean` (or `mise run dev`). The dev configs
set `config.extra.genesis_show_drafts`, so a draft chapter renders with a
**Draft preview** note. Check:

- phone and desktop widths, dark and light themes;
- `?lens=3` and `?lens=4#vN` deep links;
- reduced motion;
- the canon chips (hover shows the paragraph text);
- any diagram, including its narrow variant.

Use the mise-pinned Zola, never a bare `zola` or a second build running at the
same time in the www repo.

**2. Sign off, then commit the data.** After the founder's sign-off, run the
validator with `--staged` and commit in `data-library`:

```sh
git commit -- genesis-woh/lenses/chapter-N.json genesis-woh/lenses/_lenses.json \
              genesis-woh/lenses/chapter-N-editor-report.md genesis-woh/lenses/chapter-N-signoff-package.md
```

Add `canon-map.json` to that list if the map changed. Push.

**3. Regenerate the chapter stubs.** The stub `description` depends on whether
the lens file is `stable`. A stable chapter reads "…in four lenses…", and any
other chapter reads "Hebrew with transliteration beside the … literal
translation". So regenerate after bumping `data/library` in the www repo:

```sh
mise run genesis                              # = python3 scripts/build_genesis_pages.py
python3 scripts/build_genesis_pages.py --check   # exit 1 if any stub is stale
```

The script writes `content/genesis/1.md … 50.md`, which are frontmatter only
and marked GENERATED. Edit the script, never the stubs. It never touches the
hand-written `content/genesis/_index.md`. When a wave ships, update that
intro's last paragraph, which says which chapters are published. Commit the
changed stubs (and the intro) in `data-content`, then push.

**4. Bump the parents.** In the www repo, commit the `data/library` and
`content` pointers together, for example "Publish Genesis N lenses", and push
`main`. Cloudflare Pages deploys `main`. Check
`https://www.wheelofheaven.world/genesis/N/`:

- the meta line reads "Reading and Meaning 1.0.0";
- there is no Draft preview note;
- the index tile reads "Four lenses".

**When layer 2 changes later**, for example a translation revision of a
chapter that has a lens file, the digest no longer matches and the validator
flags the lens file as stale. Re-read the affected readings and segments,
update `basedOn`, and route the change back through the Editor and Reviewer
before the founder signs it off again.

## Related

- [Genesis four-lens reader](@/components/interactive/genesis-reader.md), the component
- [Source-Text Translation](@/contributing/content/source-text-translation/_index.md), which produces layer 2
- [Grounded Production](@/contributing/content/grounded-production.md), for core claim records and bindings
- [Editorial Passes](@/contributing/content/editorial-passes.md), for claim types
