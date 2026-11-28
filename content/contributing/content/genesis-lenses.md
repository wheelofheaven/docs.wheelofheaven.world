+++
title = "Genesis Lenses (Reading and Meaning)"
description = "How lenses 3–4 of the Genesis reader are written: schema 2 data model, the decoding glossary for the Reading, canon-first labelling for the Meaning and notes, Writer to founder sign-off, validator, publishing."
template = "page.html"
weight = 57
+++

The [Genesis reader](https://www.wheelofheaven.world/library/genesis-woh/lenses/)
shows every verse in four lenses. Lenses 1–2 (Hebrew and the literal
translation) come from the finished
[Genesis-WoH](https://www.wheelofheaven.world/library/genesis-woh/)
translation, with all 50 chapters `stable`. This page covers the work that
produces **lenses 3 and 4** and the passage notes. Since `schemaVersion` 2
(founder decision 2026-11-28) these are:

- **Reading (lens 3, `decoded`):** the literal sentence again, with each
  word the dictated canon decodes swapped in (*Elohim* → "the Sky People",
  the tree of knowing good and bad → "the scientific books"). Nothing else
  changes, and the swapped words are not marked. It is produced
  **mechanically** from a signed-off
  [decoding glossary](#decoding-glossary), not written freely.
- **Meaning (lens 4, `meaning`):** each verse or verse group retold in plain
  third-person sentences as the Messages understand it, with a claim label
  and the canon paragraphs it rests on. One card in the reader per unit.
- **Passage note (`note`):** the longer commentary on a passage, folded under
  its Meaning cards behind the note icon. It holds labelled paragraphs, an
  optional visual and the passage's literal lines.

In schema 1 (2026-11-27), "Reading" was the retelling (now Meaning) and
"Meaning" was the passage commentary (now the note).

For how the reader renders this data (slider, note icons, claim dots, canon
refs, draft gating), see the component page:
[Genesis four-lens reader](@/components/interactive/genesis-reader.md).

## Scope and order

- Lenses 3–4 are written for the primeval history, Genesis 1–11, first, in
  waves: Genesis 1, then A (2–3), B (4–5), C (6–9) and D (10–11). In Genesis
  12–50 the canon speaks only to 18:20–21, 19, 22, 28 and 35.
- English only for now.
- Genesis 1–5 are `stable` at **1.1.0** (schema 2, decoded Reading included),
  signed off 2026-11-28, and live. Genesis 1–3 were first signed off at 1.0.0
  on 2026-11-27, and Genesis 4–5 at 1.0.0 on 2026-11-28.
- A chapter is published only after the founder signs it off. Until then its
  lens file renders on the local dev server only.
- A structural change ships for all affected chapters at once, after sign-off.
  The live version stays in place meanwhile.

## Data model

Everything lives in `data-library/genesis-woh/lenses/`. **Layer-2 files
(`genesis-woh/chapter-N.json`) are never edited from the lens track.** The
lens folder's
[`README.md`](https://github.com/wheelofheaven/data-library/blob/main/genesis-woh/lenses/README.md),
`schema.json` and `decoding-glossary.json` are the authoritative
specification. This section summarises them.

| File | Purpose |
|---|---|
| `_lenses.json` | Index: `schemaVersion` (2), `canonMapVersion`, one row per lens chapter (`chapter`, `file`, `status`, `version`, `signedOffBy`, `signedOffAt`, each copied from the chapter file). It is deliberately not named `_meta.json`. |
| `canon-map.json` | Every verse of Genesis 1–50 mapped exactly once to the canon paragraphs that quote, comment on or allude to it |
| `schema.json` | JSON Schema (draft 2020-12) for `chapter-N.json`, schema 2 |
| `chapter-N.json` | Lenses 3–4 and the passage notes for chapter N |
| `decoding-glossary.json` | The decoding glossary for lens 3 (1.0.0, stable, Genesis 1–11) |
| `decoding-glossary-summary.md` | The glossary as one table, with the founder rulings |
| `chapter-N-editor-report.md`, `chapter-N-signoff-package.md` | The chapter's audit trail |
| `decoded-review-YYYY-MM-DD.md` | The independent word-diff review of a decoded Reading wave |

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
- **`refs[].standing`** is derived from `standingRules` (see
  [What counts as canon](#what-counts-as-canon)). The optional
  `flags: ["sensitive"]` marks passages that need editorial review before
  use, such as the ETTMTTP descent passages 2:104 and 2:123.
- **Entry `relation`** is the strongest canon-standing relation (`quotes` >
  `comments` > `alludes`). It is `opinion` if the entry has only author-opinion
  refs, `check` if it has only unconfirmed refs, and `silent` if it has no refs.

When the map changes, bump its `version`, then bump `canonMapVersion` in every
lens file and in `_lenses.json`.

### chapter-N.json (schema 2)

```json
{
  "schemaVersion": 2, "bookSlug": "genesis-woh", "chapter": 1,
  "basedOn": { "translationVersion": "1.1.0", "layer2Digest": "sha256:…", "canonMapVersion": "1.1.0" },
  "lens": { "track": "lens", "version": "1.1.0", "status": "stable",
            "modelDrafts": [], "reviewerReport": {},
            "signedOffBy": "…", "signedOffAt": "2026-11-28T15:00:00Z",
            "coreClaims": { "woh-claim-0009": "0.2.0" } },
  "passages": [ {
    "id": "gen-1-day-1", "range": ["1:1", "1:5"],
    "title": { "en": "The First Day: Finding the Planet" },
    "canonCoverage": "quotes",
    "decoded": [ { "refs": ["1:1"], "text": { "en": "When the Sky People began to shape the skies and the land—" } } ],
    "meaning": [ { "refs": ["1:1"], "text": { "en": "…" },
                   "basis": "canon", "claim": "framework",
                   "canon": ["TBWTT-2:4", "TBWTT-2:5"], "coreClaim": "woh-claim-0001" } ],
    "note": {
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
- **`lens.version`** is semver. While a revision is under review it may carry
  a pre-release tag (`1.1.0-rc1`). A `stable` lens has a plain release
  version.
- **`passages[]`** are contiguous verse ranges that do not overlap and cover
  the chapter. `canonCoverage` is the strongest canon relation over the
  passage's verses (`quotes | comments | alludes | silent`). Map relations
  `opinion` and `check` count as `silent`, so the reader shows the "Messages do
  not comment" marker for them.
- **`decoded[]`** (lens 3, Reading) holds `{"refs": […], "text": {"en": …}}`
  and nothing else: no claim label and no canon refs, because the decoding is
  justified in the glossary, not per sentence. Every passage has the key; an
  empty list is allowed. Once any passage of a chapter has a decoded unit,
  decoded units must cover every verse of the chapter exactly once, inside
  their passage. In practice each decoded unit has the same refs as a Meaning
  unit. The reader shows a unit in the card of its first verse, so a unit
  should not reach into the next card (validator warning).
- **`meaning[]`** (lens 4, Meaning; schema 1 `readings`) must cover every
  verse of the chapter exactly once and stay inside its passage. Refs are
  `"C:V"` or `"C:V-W"`. Each unit is one card in the reader.
  - `basis` is `canon` (the reader shows "From the Messages") or `synthesis`
    ("A Wheel of Heaven reading").
  - `claim` is `direct | framework | inferred | speculative`.
  - `canon` lists the refs the unit rests on. `coreClaim` is optional.
- **`note`** (the passage note; schema 1 `explanation`): `paragraphs[][]`
  are paragraphs made of claim-labelled segments. Each segment can carry
  `canon` and `coreClaim`. `visual` is optional and must name a diagram that
  exists in Bifrost's `static/diagrams/`.
- **Canon refs** are plain strings (`"TBWTT-2:4"`) only when their standing is
  `canon`. Every other standing is written out, for example
  `{"ref": "LWTE-1:69", "standing": "author-opinion"}`. The reader marks
  these as "opinion".
- **Text** is markdown rendered inline. Use `*italics*` for transliterated
  Hebrew.

### Migrating from schema 1

`data-library/scripts/migrate_genesis_lenses_v2.py` converts schema-1 files in
place: per passage, `readings` → `meaning`, `explanation` → `note`, and a new
empty `decoded` before `meaning`. Everything else is carried over untouched,
including `lens.version` and the sign-off, because no reader-facing text
changes. `_lenses.json` moves to `schemaVersion` 2. The migration is lossless
and idempotent. It maps every file back to schema 1 and compares before
writing, and it leaves a schema-2 file as it is.

```sh
python3 scripts/migrate_genesis_lenses_v2.py --dry-run   # report only
python3 scripts/migrate_genesis_lenses_v2.py             # migrate in place
```

The validator rejects a schema-1 file, or a schema-1 key name, with an error
that points at this script.

## Canon-first labelling rules

These are founder rulings and they bind every lens chapter.

### What counts as canon

The canon is **the dictated Messages only** (ADR 0018):

| Standing | Source | Use |
|---|---|---|
| `canon` | Paragraphs dictated in *The Book Which Tells the Truth* (TBWTT) and in chapter 2 of *Extraterrestrials Took Me to Their Planet* (ETTMTTP) | May ground a `framework` claim or a decoding |
| `narration` | The author's narration around the dictation | Not canon. Cite the dictated paragraph instead. Never in the map. |
| `check` | Reserved for paragraphs whose dictation status is unconfirmed | Not canon until the founder rules |
| `author-opinion` | *Let's Welcome the Extraterrestrials* (LWTE); ETTMTTP chapter 3, "The Keys", which is author-written and not dictated | Always cited with this label. **Never the sole basis of a `framework` claim, and never the basis of a decoding.** |

### How to write the Meaning and the notes

1. **Follow the canon where it speaks.** The Meaning and the note follow
   TBWTT wherever it comments on the passage, and cite the paragraph
   (chapter:paragraph). Where TBWTT speaks, the Meaning uses its own words.
2. **Mark silence plainly.** A passage the canon does not touch gets
   `canonCoverage: "silent"`. In lens 4 the reader then prints "The Messages
   do not comment on this passage; what follows is a Wheel of Heaven
   reading." above the cards. Every unit and segment carries an honest label,
   usually `inferred` or `speculative`.
3. **The Meaning is in the third person** and retells the sense. It does not
   shadow the literal wording, because lenses 2–3 already give the words.
4. **Name the actors** (founder rulings 2026-11-27 and 2026-11-28):
   - *Elohim*: "those who came from the sky" at the **first mention in each
     chapter**, then "the Sky People". The word "Elohim" stays out of the
     Meaning; the notes may still name it.
   - YHWH and YHWH-Elohim: **"the creators"**.
   - Verbatim canon quotations stay as printed (a quotation that prints
     "Yahweh" keeps it). Notes about the Hebrew may name the Hebrew form.
   - Layer 2 keeps "the Elohim", "YHWH" and "YHWH-Elohim".
5. **Put the canon figure first.** For example, TBWTT 2:10 gives a creation
   "day" as about 2,000 Earth years. The Wheel of Heaven model's ≈ 2,160 years
   (claim 0059) comes second and is labelled `framework`. The creation-week
   diagram is drawn in the same order.
6. **Never present canon content as what the Hebrew says.** Keep philology
   (`direct`, about the text) apart from the canon reading (`framework`). When
   a canon link is the project's own pairing of a verse with a paragraph,
   label it `inferred`. Never imply that the creators wrote Genesis.
7. **Keep claims in their place.** Some claim records have a ruled single
   location:
   - the TBWTT 2:43 election statement (claim 0076) is quoted **once**, at
     Genesis 3:22, in 0076's scope wording, labelled `framework`, and not in
     Genesis 2;
   - TBWTT 2:25 "each human race corresponds to a team of creators" stays out
     of the Genesis lens;
   - TBWTT 2:89 is held for the Genesis 22 lens;
   - the day-3 Flood dating is `speculative`.
8. **Use ETTMTTP 2:104 and 2:123 only after editorial review.** These descent
   passages are flagged `sensitive`.
9. **Let the Meaning or the note carry what the Reading cannot.** The decoded
   Reading swaps words only. Where a swap leaves a sentence the canon
   contradicts (the ark's gopher wood and pitch, 7:18 "went on the face of the
   waters"), the Meaning or the note says so.

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

## Decoding glossary

The Reading is not written sentence by sentence. It is the layer-2 English
with a fixed set of swaps applied, and the set is the **decoding glossary**,
`genesis-woh/lenses/decoding-glossary.json`. Version 1.0.0 covers Genesis
1–11 and was signed off by the founder on 2026-11-28.

### Selection rule

A word is swapped **only where a dictated canon paragraph says what that
Genesis term is**. LWTE and ETTMTTP chapter 3 ground nothing. Where the canon
decodes only partly (a paraphrase, or a gloss not attached to the quoted
verse), the entry is labelled `inferred` and flagged in its notes. Anything
else stays literal, even if the Wheel of Heaven reading of it is well
established. The Meaning is where such readings go.

### File shape

| Key | What |
|---|---|
| `version`, `status`, `scope`, `basis`, `created` | Header. `status` runs `draft` → `stable`. |
| `rules` | `selection` (above), `applicationOrder`, `agreement`, `noMarking` |
| `entries[]` | One per decoded term (see below) |
| `rejected[]` | `{term, reason}` for each candidate not swapped, with the reason from the canon |
| `openQuestions[]` | `{id, question, options, recommended}`: the decisions put to the founder |
| `founderRulings[]`, `signedOffBy`, `signedOffAt` | The sign-off record |

Each entry has:

- `id`;
- `hebrew` (`pointed`, `translit`);
- `layer2`: the forms as they appear in the literal translation;
- `rendering` and `variants`: case, possessive and in-context forms, and the
  agreement note;
- `scope`: `applies` gives the verse ranges, and `exceptions` the verses where
  the literal sense stays;
- `canon`: the dictated paragraphs;
- `quote`: the verbatim paragraph in English (`en`) and French (`fr`);
- `claim` and `coreClaim`;
- `notes`;
- `samples`: before and after.

`applicationOrder` is `yhwh`, then `benei-ha-elohim`, then `elohim`, then the
rest, so "YHWH-Elohim" and "the sons of the Elohim" are never half-swapped by
the bare *Elohim* entry.

### Entries in 1.0.0

| Layer 2 | Reading | Where |
|---|---|---|
| the Elohim | the Sky People | all of Genesis 1–11 |
| YHWH, YHWH-Elohim | the creators | 2:4–11:9 (`inferred`; `framework` only in the five verses the canon decodes) |
| the sons of the Elohim | the creators in exile | 6:2, 6:4 |
| day one … the seventh day | age one … the seventh age | creation days 1:5–2:3 only (the seventh age `inferred`) |
| the waters above / under the dome | the clouds / the ocean | 1:7 (1:6 `inferred`) |
| the dry ground | the single continent | 1:9–10 |
| the tree of knowing good and bad | the scientific books | 2:9, 2:17 |
| the tree of life | the means of prolonging life | 2:9, 3:22, 3:24 |
| the serpent | the small group of creators | 3:1, 3:2, 3:4, 3:13, 3:14 |
| the garden of Eden | the creators' residence | 3:24 (3:23 `inferred`) |
| the cherubim | the military personnel | 3:24 |
| the flaming blade | the disintegrating atomic weapon | 3:24 |
| an offering | food | 4:3–5 |
| the ark; decks | the rocket; stages | 6:14–9:18; 6:16 |
| two of each | a living cell of each | 6:19–20 |
| evil (*ra*) | the desire to progress | 6:5, 8:21 |
| a tower / the tower | a rocket / the rocket | 11:4–5 |
| the great dragons | the great dragons (kept) | 1:21: the canon's own word |

Sample, Genesis 3:24: *"They drove out the human, and placed at the east of
the creators' residence the military personnel and the disintegrating atomic
weapon that turns itself, to guard the way to the means of prolonging life."*

Twenty-three candidates were rejected, with reasons in the JSON. They include
*ruach Elohim* (1:2), the dome, image and likeness, *adam*, garments of skin,
the Nephilim, the deluge, the rainbow, the confused tongue and the rib. The
canon names these without saying what they are, or keeps them literal.

### Founder rulings on the glossary (2026-11-28)

1. **YHWH and YHWH-Elohim → "the creators"**, both. This is the canon's own
   wording each time it explains a Genesis YHWH verse. It also keeps the
   Hebrew name shift visible: Genesis 1 has "the Sky People", Genesis 2–11
   "the creators".
2. **"I/me" in direct speech** after a plural subject stays singular as
   printed. One speaks for the group, and the Hebrew is singular.
3. **Creation "day" → "age"** ("age one", "the sixth age"), with the seventh
   day included as an `inferred` extension.
4. **Tree of knowledge → "the scientific books"** for the named tree only
   (2:9, 2:17). "Eat" stays, because the canon itself calls the eating an
   image.
5. **Garden:** only 3:23–24 become "the creators' residence".
6. **Ark → "the rocket"** is a word swap only. Clashing words (gopher wood,
   pitch, 7:18) stay, and the Meaning note corrects them.
7. **Pairs → cells** only in the instruction (6:19–20). The boarding
   narrative stays literal.
8. **Evil:** only *ra* becomes "the desire to progress". *Ra'at*
   ("wickedness") stays.
9. **Offerings:** "food" in 4:3–5 only. The burnt offerings of 8:20 stay.
10. **Edge verses:** 4:1 keeps "YHWH himself!"; 4:26 reads "the name of the
    creators"; 9:26 reads "the creators, the Sky People of Shem".
11. **Tanninim** keep "the great dragons", the canon's own word.
12. **Meaning naming:** "the creators" for the YHWH strand, and "those who
    came from the sky" at the first *Elohim* mention per chapter (see
    [How to write](#how-to-write-the-meaning-and-the-notes)).
13. **Serpent:** "the small group of creators", including 3:14's "The
    creators said to the small group of creators", which is the canon's own
    contrast.

**No marking** (founder ruling 2026-11-28): the swapped words carry no
visual marking in the Reading.

**Agreement rule.** After a swap, pronouns and verbs in the **same sentence**
follow the new plural subject ("he ceased" → "they ceased", "the Elohim
knows" → "the Sky People know"). Antecedents across sentences need a human
check. The glossary's `rules.agreement` lists the verses where *Elohim* or
YHWH stands near he/his/him.

### Workflow: draft → founder sign-off → application → review

Changing the glossary or decoding a new chapter goes through four steps.
Each step leaves an audit trail.

| Step | Who | Output |
|---|---|---|
| 1. **Draft** | Writer | Reads every dictated paragraph that quotes or comments on the chapter's verses, in English and French. Proposes an entry only where the paragraph says what the term is, with verbatim `quote`, `canon`, `scope`, `exceptions`, `variants` and before/after `samples`. Records each rejected candidate with its reason. Turns every judgement call into an `openQuestions` item with options and a recommendation. Writes `decoding-glossary-summary.md`. The glossary stays `status: "draft"` (0.x). |
| 2. **Founder sign-off** | Founder | Answers the open questions. "sign-off ok" accepts the recommendations not ruled otherwise. The orchestrator records `founderRulings`, sets `status: "stable"`, `version: "1.0.0"` (later changes bump it), `signedOffBy` and `signedOffAt`, and updates the summary. Nothing is applied before this. |
| 3. **Mechanical application** | Orchestrator, by script | Rebuilds every decoded unit from the layer-2 `i18n.en` (read only) on each run, so the build is idempotent. It applies the entries in `applicationOrder`, honouring each entry's scope and exceptions, and writes one decoded unit per Meaning unit (same refs). Then it applies the hand-checked agreement fixes. Each fix is a before/after pair that must occur exactly once, so a stale fix fails the build. It writes a **substitution log** (every swap, per verse, with counts per chapter) and an **agreement log** (every fix, with the antecedent that justifies it). Meaning naming and note wording are aligned in the same pass, and logged the same way. |
| 4. **Independent word-diff review** | Reviewer | Runs its **own** token diff of every decoded unit against the layer-2 verses its refs expand to *before* reading the builder's logs. Classifies every hunk as a glossary swap, a glossary variant or a logged agreement change. Anything else is a violation. Checks ref parity with the Meaning, verse coverage, missed swaps, quotation balance and naturalness. Diffs the Meaning and note edits against the previous commit. Runs the validator. Writes `decoded-review-YYYY-MM-DD.md` with counts, a violations table, verdicts per chapter and items for the founder. |

After the review, the orchestrator applies the agreed fixes. Each chapter's
`lens.version` is bumped (Genesis 1–5 went 1.0.0 → 1.1.0), and the chapters go
back to the founder for sign-off with the review and logs. Layer-2 problems
found along the way, such as a missing closing quotation mark, cannot be
fixed in lens 3. They are queued as layer-2 errata for the translation
pipeline.

The Genesis 1–5 wave: 95 decoded units over 138 verses, 108 glossary
substitutions and 20 agreement fixes. The review found 0 violations.

## Pipeline: Writer → Editor → Reviewer → founder

The roles mirror the
[Source-Text Translation](@/contributing/content/source-text-translation/roles.md)
pipeline. Each role writes to the lens file and leaves an audit trail. Each
status step bumps `lens.version` and updates the chapter's row in
`_lenses.json`. The decoded Reading follows the
[glossary workflow](#workflow-draft-founder-sign-off-application-review)
above. The table below governs the Meaning and the notes.

| Step | Role | Status after | What it does |
|---|---|---|---|
| 1 | **Writer** | `draft` (0.1.0) | Reads the layer-2 chapter, the canon-map entries for its verses and every cited canon paragraph. Sets the passage boundaries, then drafts the Meaning units and the passage notes under the rules above. Fills `basedOn` (using `--digest N`) and `coreClaims`, and adds itself to `modelDrafts`. |
| 2 | **Editor** | `editor-review` (0.2.0) | Re-checks every attribution against the canon paragraph, in both the French original and the project English. Matches every quotation verbatim against the canon and layer-2 English, and re-checks labels against the decision tree and the pinned core records. Fixes wording, splits segments that mix labels and drops claims that are out of place. Writes `chapter-N-editor-report.md`: method, every change with its reason, and flags for the founder. |
| 3 | **Reviewer** | `reviewer-approved` | Comes to the chapter fresh and forms initial verdicts *before* opening the editor report. Re-derives every canon citation and checks every Hebrew claim against the pointed text. Records `lens.reviewerReport`: `reviewer`, `reviewedAt`, `reviewedVersion`, `method`, `counts`, and `verdicts[]` per passage and per unit (`approve`, `revise` or `flag-for-human`, with citations and reasoning). |
| 4 | Orchestrator | `awaiting-human` | Applies the agreed revisions, gets the validator clean, and writes `chapter-N-signoff-package.md`: a summary, the open flags as decisions with a recommended option, and a link to the chapter on the dev server. |
| 5 | **Founder** | `stable` (1.0.0) | Reviews the package and the rendered chapter on the local dev server. "sign-off ok" ratifies the package. The orchestrator then sets `status: "stable"`, `version: "1.0.0"`, `signedOffBy` (the founder's handle) and `signedOffAt`, and updates the `_lenses.json` row. Rulings that bind later chapters go into this page and the lens README. |

A later revision of a stable chapter (for example, adding the decoded
Reading) gets a minor version (1.1.0, with `-rcN` while under review) and
goes back through review and founder sign-off.

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
python3 scripts/validate_genesis_lenses.py --glossary genesis-woh/lenses/decoding-glossary.json
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
   - `schemaVersion` is 2 (a schema-1 file or key name is an error that
     points at the migration script);
   - `bookSlug` and the chapter number match the file name;
   - `translationVersion` and `canonMapVersion` are current;
   - the digest matches.
3. **Coverage:**
   - passages and Meaning units each cover every verse once, and Meaning
     units stay inside their passage;
   - `decoded` is present on every passage (empty allowed);
   - once a chapter has any decoded unit, decoded units cover every verse
     exactly once, inside their passage, with only `refs` and a non-empty
     `text.en`;
   - a decoded unit reaching into the next Meaning card is a warning.
4. **`canonCoverage`** equals the canon-map value for the passage's verses.
5. **Canon refs:** every ref exists, non-canon standings are written out, and
   LWTE refs carry `author-opinion`.
6. **`framework` grounding:** a `framework` Meaning unit or note segment
   needs a canon-standing ref or a `coreClaim`. It cannot rest on
   author-opinion or `check` refs alone.
7. **`basis: "canon"`:** the Meaning unit cites a canon-standing ref that the
   map attaches to one of its verses.
8. **Core claims:** every `coreClaim` is listed in `lens.coreClaims` and exists
   in the core catalog. Version drift is a warning.
9. **Sign-off:** `stable` requires `signedOffBy`, `signedOffAt` and a plain
   release version. A pre-release tag is allowed only before sign-off.
10. **`_lenses.json`:** `schemaVersion` 2, `canonMapVersion` matches, rows
    match their lens files, and every lens file is listed.
11. **`--staged`:** fails if any `genesis-woh/chapter-*.json` (layer 2) is
    staged. Lens commits never touch layer 2.
12. **`--glossary PATH`:** loads the decoding glossary and runs the lens-3
    glossary hook on every decoded unit. An unreadable glossary is an error.
    The hook's checks are still a stub. The intended rule is that every
    swapped-in word is a glossary rendering for a Hebrew term of the verse,
    and every glossary term in scope is swapped. Until it lands, the
    independent word-diff review is the check.

## Preview, regenerate stubs, publish

Three repos are involved:

- `data-library`, which holds the lens data;
- `data-content`, which holds the `library/genesis-woh/lenses/` stubs;
- the www repo, which pins both as submodules (`data/library` and `content`).

Commit each submodule before its parent pointer, and always commit by explicit
path. The workspace usually carries unrelated work in progress.

**1. Preview on the dev server.** In the www repo, bring `data/library` to the
lens commit and run `mise run dev-lean` (or `mise run dev`). The dev configs
set `config.extra.genesis_show_drafts`, so a draft chapter renders with a
**Draft preview** note. Check:

- phone and desktop widths, dark and light themes;
- all four lenses, including `?lens=3` and `?lens=4#vN` deep links;
- the note icons in lens 2 and in the passage notes, with and without JS;
- reduced motion;
- the canon refs (hover shows the paragraph text);
- any diagram, including its narrow variant.

Use the mise-pinned Zola, never a bare `zola` or a second build running at the
same time in the www repo.

**2. Sign off, then commit the data.** After the founder's sign-off, run the
validator with `--staged` and commit in `data-library`:

```sh
git commit -- genesis-woh/lenses/chapter-N.json genesis-woh/lenses/_lenses.json \
              genesis-woh/lenses/chapter-N-editor-report.md genesis-woh/lenses/chapter-N-signoff-package.md
```

Add `canon-map.json`, `decoding-glossary.json`,
`decoding-glossary-summary.md` or the `decoded-review-*.md` to that list
when they changed. Push.

**3. Regenerate the chapter stubs.** The stub `description` depends on whether
the lens file is `stable`. A stable chapter reads "…in four lenses: the
Hebrew, a literal translation, …" and names the decoded reading and the
meaning. Any other chapter reads "Hebrew with transliteration beside the …
literal translation". So regenerate after bumping `data/library` in the www
repo:

```sh
mise run genesis                              # = python3 scripts/build_genesis_pages.py
python3 scripts/build_genesis_pages.py --check   # exit 1 if any stub is stale
```

The script writes `content/library/genesis-woh/lenses/1.md … 50.md`, which
are frontmatter only and marked GENERATED. Edit the script, never the stubs.
It never touches the hand-written `content/library/genesis-woh/lenses/_index.md`.
When a wave ships, update that intro: its last paragraph says which chapters
are published, and its lens list says whether the Reading is ready. Commit
the changed stubs (and the intro) in `data-content`, then push.

**4. Bump the parents.** In the www repo, commit the `data/library` and
`content` pointers together, for example "Publish Genesis N lenses", and push
`main`. Cloudflare Pages deploys `main`. Check
`https://www.wheelofheaven.world/library/genesis-woh/lenses/N/`:

- the header meta reads "… verses · Four lenses";
- the colophon reads "Reading and Meaning: version X.Y.Z, reviewed and signed
  off …";
- there is no Draft preview note, and no "Reading in preparation" once the
  decoded units are in;
- the index tile reads "Four lenses", and the chapter switcher shows the dot.

The old `/genesis/N/` URLs answer `301` to the new path through www
`static/_redirects`, so nothing needs to change there.

**When layer 2 changes later**, for example a translation revision of a
chapter that has a lens file, the digest no longer matches and the validator
flags the lens file as stale. Rebuild the decoded units from the new layer 2,
re-check the agreement fixes (a fix whose "before" no longer occurs fails the
build), re-read the affected Meaning units and note segments, and update
`basedOn`. Then route the change back through review before the founder signs
it off again.

## Related

- [Genesis four-lens reader](@/components/interactive/genesis-reader.md), the component
- [Source-Text Translation](@/contributing/content/source-text-translation/_index.md), which produces layer 2
- [Grounded Production](@/contributing/content/grounded-production.md), for core claim records and bindings
- [Editorial Passes](@/contributing/content/editorial-passes.md), for claim types
