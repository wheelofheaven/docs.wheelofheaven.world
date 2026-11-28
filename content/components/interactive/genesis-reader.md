+++
title = "Genesis four-lens reader"
description = "The Genesis reader at /library/genesis-woh/lenses/: every verse in four lenses (Hebrew, Literal, decoded Reading, Meaning), a sticky 4-stop slider, per-verse stepping, note icons, chapter switcher and draft gating."
template = "page.html"
weight = 92
+++

The Genesis reader at
[/library/genesis-woh/lenses/](https://www.wheelofheaven.world/library/genesis-woh/lenses/)
shows each verse of Genesis in **four lenses**. One sticky slider switches
every verse at once, and a single verse can be stepped through the lenses on
its own. It launched on 2026-11-27 at `/genesis/`. On 2026-11-28 it moved
under the library, and the same day version 2 of the lenses went live for
Genesis 1–5. Chapters 6–50 show lenses 1–2, and lenses 3–4 are marked as
coming.

| Lens | Name | Data | Unit |
|---|---|---|---|
| 1 | **Hebrew** | Masoretic text with a transliteration under each word (`genesis-woh/chapter-N.json`, layer 1) | card |
| 2 | **Literal** | The Wheel of Heaven literal translation (`genesis-woh/chapter-N.json`, layer 2). Its translator's note opens from the note icon. | card |
| 3 | **Reading** | The **decoded translation**: the literal sentence with the words the canon decodes swapped in, unmarked (`genesis-woh/lenses/chapter-N.json`, `decoded[]`) | decoded unit, shown in the card of its first verse |
| 4 | **Meaning** | The verse retold in the third person as the Messages read it, with its claim label and canon refs (lens file, `meaning[]`) | card |
| – | Passage note | The longer commentary on the whole passage, folded under the Meaning cards behind the note icon (lens file, `note`) | passage |

A **card** is one Meaning unit: the verses that one Meaning sentence covers,
usually a single verse. Every chapter opens on **lens 2**. Interpretation stays
out of lenses 1–2. Passage titles appear only in lenses 3–4. Claim labels,
canon refs and the canon-coverage marker appear only in lens 4.

### What changed in version 2 (2026-11-28)

| Before (v1, 2026-11-27) | Now (v2) |
|---|---|
| Reader at `/genesis/` and `/genesis/N/` | `/library/genesis-woh/lenses/` and `/library/genesis-woh/lenses/N/`. The old URLs answer `301` (`/genesis/*` → `/library/genesis-woh/lenses/:splat` in www `static/_redirects`). |
| Lens 3 "Reading": a per-verse retelling with claim labels | Lens 3 "Reading": the decoded translation. *Elohim* reads "the Sky People", YHWH and YHWH-Elohim read "the creators", and so on, under the [decoding glossary](@/contributing/content/genesis-lenses.md#decoding-glossary). No marking, no labels, no refs. |
| Lens 4 "Meaning": the passage commentary, with the verse cards folded away | Lens 4 "Meaning": the former per-verse retellings, one card each. The former commentary is the **passage note**, folded under the cards. |
| "+ Translation note" disclosure in lens 2 | The library reader's note icon at the end of the line |
| Canon refs as bordered chips | Quiet canon refs: one mono run after the sentence |
| Prev/next pager only | A chapter switcher under the header, plus the pager |
| Status line in the header | A colophon at the foot of the page |

Data moved from `schemaVersion` 1 to 2 (`readings` → `meaning`,
`explanation` → `note`, new `decoded`). The data-library script
`migrate_genesis_lenses_v2.py` converts v1 files losslessly. See
[Genesis lenses (writing pipeline)](@/contributing/content/genesis-lenses.md).

**Source** (all in [`wheelofheaven/bifrost`](https://github.com/wheelofheaven/bifrost)):

- [`templates/genesis-section.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/genesis-section.html) is the index: header with a "Start with Genesis 1" link, the 50 chapter tiles in four groups, then the hand-written intro.
- [`templates/genesis-chapter.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/genesis-chapter.html) is one chapter. It loads the data, gates drafts and renders the header, chapter switcher, slider, passages, live region, colophon and pager.
- [`templates/macros/genesis.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/genesis.html) holds `lens_slider`, `chapter_nav`, `passage`, `lens_card`, `pane_original`, `pane_literal`, `note_icon`, `pane_decoded`, `pane_meaning`, `coverage`, `passage_note`, `segment`, `canon_refs`, `canon_chip` and `visual`.
- [`templates/macros/claim.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/claim.html) is the inline claim marker, shared with the [`claim` shortcode](@/components/shortcodes/claim.md).
- [`templates/partials/schema/genesis-chapter.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/schema/genesis-chapter.html) is the `Chapter` JSON-LD, `isPartOf` the Genesis-WoH `Book`.
- [`sass/pages/_genesis-reader.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/pages/_genesis-reader.scss) holds the lens state machine, the sticky band, motion and print. `.genesis` and `.genesis__intro` are in the `_grammar.scss` page lists.
- [`static/js/genesis-lens.js`](https://github.com/wheelofheaven/bifrost/blob/main/static/js/genesis-lens.js) is bundled by `scripts/bundle.js` into `js/dist/genesis.bundle.js`. Only `genesis-chapter.html` loads it, not the core bundle.
- [`tools/gen_diagrams.py`](https://github.com/wheelofheaven/bifrost/blob/main/tools/gen_diagrams.py) builds `creation-week` and `creation-week-narrow`.

## Data flow

```
data/library/genesis-woh/chapter-N.json          lenses 1–2 (always present)
data/library/genesis-woh/lenses/chapter-N.json   lenses 3–4 + passage notes (optional, schemaVersion 2)
content/library/genesis-woh/lenses/N.md          generated stub: frontmatter only
content/library/genesis-woh/lenses/_index.md     hand-written intro (genesis-section.html)
```

`data/library` is the `data-library` submodule of the www repo, and
`content` is the `data-content` submodule. The stub carries `chapter`,
`chapter_title`, `verses`, `group` and `group_name`, and is written by
`scripts/build_genesis_pages.py` (`mise run genesis`). The template renders
everything else from data.

## Draft gating

A lens file renders only when `lens.status == "stable"`:

```tera
{% set has_lenses = lensfile and (lens_status == "stable" or show_drafts) %}
```

`show_drafts` is `config.extra.genesis_show_drafts`. Production `config.toml`
never sets it. `scripts/build_dev_config.py` writes it into
`config.dev.toml` and `config.lean.toml`, so `mise run dev` and
`mise run dev-lean` show draft, editor-review and awaiting-sign-off lens files.
On the dev server a draft chapter carries a **Draft preview** note that says
how far the lens file has got. Its index tile reads "Four lenses · draft". In
production the same chapter renders as lenses 1–2, and its tile reads
"Hebrew + literal".

Without a rendered lens file:

- slider stops 3–4 are `disabled` and labelled "coming";
- each verse is its own card, offering lenses 1–2 only;
- the hint line says Reading and Meaning are coming, written for chapters
  1–11 first;
- the header meta reads "Hebrew and literal for now".

### "Reading in preparation"

Lens 3 may be written after lens 4. A rendered lens file with no `decoded`
unit at all prints a dashed **Reading in preparation** note above the cards
(lens 3 only), and each card's Reading pane says "Reading in preparation".
Both are hidden in print. Genesis 1–5 have their decoded units, so neither
shows there.

## Header, chapter switcher, colophon

- The header has an eyebrow linking back to the index, the title, the
  chapter title, and a meta line: "31 verses · Four lenses" (or "Hebrew and
  literal for now").
- `genesis::chapter_nav` renders the **chapter switcher**: ← previous, a
  `<details>` disclosure "Chapter N of 50" with a grid of all 50 chapters,
  and next →. It opens without JS. The script closes it on Escape and on a
  click outside. Chapters with four lenses carry a dot, under the same draft
  rule as the index. The current chapter has `aria-current="page"`.
- Version and review state sit in the **colophon** at the foot of the page,
  not the header. One line gives the literal translation's version and
  sign-off date. The other reads "Reading and Meaning: version 1.1.0,
  reviewed and signed off 2026-11-28", or names the status of a draft.
- The **pager** under the colophon has previous chapter, "All chapters" and
  next chapter.

## The slider

`genesis::lens_slider(has_lenses, chapter)` renders a `<form>` holding a
`fieldset role="radiogroup"` of **four radios** (`name="genesis-lens"`,
`value` 1–4, lens 2 `checked`). The radios stay in the accessibility tree and
the tab order, and arrow keys move between stops natively. The visible
`label.genesis-lens__stop` pills sit over an ink thumb that slides with
`--lens-i`. Each stop's `title` describes its lens.

- **Sticky** under the navbar: `top` is `--genesis-lens-top`, `5.75rem` on
  desktop and `4.75rem` at 1024px and below. On phones the navbar hides on
  scroll down, and the slider moves up to `0.5rem` by changing `top`, not by
  a transform, so no glass sits under a transformed ancestor. See the
  [glass invariants](@/contributing/dev/bifrost-theme.md#glassmorphism-invariants).
- **Sticky band.** While the slider is stuck, the script sets
  `.genesis-lens--stuck`. A `::before` band of page background then reaches
  from the top of the viewport to just below the pill and fades out there,
  so the text scrolls away under it instead of showing through. The band is
  a pseudo-element, so sticking causes no layout shift. It is opaque, so it
  adds no `backdrop-filter` layer. The pill drops its shadow while stuck.
- Every stop is a 44px target. The stop numbers hide below 480px.
- **Keys 1–4** set the page lens. They are ignored with a modifier key,
  while typing in a field, while the search modal is open, and for a disabled
  stop. The "Keys 1–4 move the slider" hint hides on `hover: none` devices.

### State machine (pure CSS)

Which pane shows is decided in CSS from the checked radio, so the reader works
**without JavaScript**:

```scss
@mixin when-page-lens($k) {
    .genesis:has(.genesis-lens__input[value="#{$k}"]:checked) & { @content; }
    .genesis[data-page-lens="#{$k}"] & { @content; }
}
```

The `:has()` rule and the `[data-page-lens]` twin are emitted separately,
because a selector list holding an unsupported `:has()` would drop the whole
rule. The JS keeps `data-page-lens` on `.genesis--chapter` current, which
covers browsers without `:has()`.

Panes open and close on `grid-template-rows: 0fr ↔ 1fr`, with `visibility`
and `opacity`. Every card stays in place in all four lenses. In lens 4 each
passage's `.genesis-passage-note` bar also opens under its cards. The whole
state machine sits under `@media screen`.

### Per-verse step

Each card has a gutter bar: the verse reference (a `#vN` link), a **step**
button and a **reset** button, all 44px. Both buttons ship `hidden`, and the
JS reveals the step. The step shows the **name of the lens it leads to**
("Reading", "Meaning", …), and the script keeps that name, its `title` and
its `aria-label` current. Stepping cycles the card through the lenses it can
show, 1→2→3→4 (or 1→2 without a lens file), by setting `data-lens` on the
card. Lens 4 is per card in v2, so a card can be stepped into the Meaning.
Reset ("Back to the page lens") clears the card's own lens. Moving the page
slider resets every card.

## Note icons

Both kinds of note open from the **library reader's note icon**: the same
bracketed speech-bubble SVG and `.library-book__commentary-link` class as
`macros/library.html` (styled in `_library.scss`). `genesis::note_icon`
renders it with an extra `.genesis-note-link` class. Here it opens an
inline fold (`.genesis-fold`) under its line instead of the library's
popover.

| Note | Where | Opens |
|---|---|---|
| Translation note | Lens 2, at the end of a verse line that has `notes.official` | `.genesis-note`, "Translation note" |
| Passage note | Lens 4, in a bar "Note on this passage" under the passage's cards | `.genesis-passage-note__body` |

- Without JS the folds are open and the icons stay `hidden`. With JS
  (`.genesis--js`) the folds close, and each icon gets `aria-expanded` and
  `aria-controls`, plus an "Open …"/"Close …" label.
- Escape inside an open note closes it and returns focus to the icon.
- The words of the passage-note bar also open the note on a pointer click.
  The icon is the keyboard and screen-reader control.
- Opening a fold moves nothing above it.

## URL, memory, deep links

- `?lens=N` is written with `history.replaceState`, and the `#vN` hash is kept.
  Lens 2 removes the parameter.
- The choice is remembered in `localStorage` under `woh-genesis-lens`,
  wrapped in try/catch so blocked storage still works. On load the order is
  URL, then stored value, then 2. The starting lens is not stored, so a chapter
  without a lens file clamps to 2 without overwriting a remembered 3.
- `#vN` anchors sit at the top of each card. A multi-verse card carries one
  extra anchor per verse it covers. Every card is present in every lens, so a
  deep link lands on the verse's card in all four. Passages use
  `content-visibility: auto`, so the script re-aims for a few frames and again
  after web fonts load, and stops as soon as the reader scrolls. The target
  card gets a brief wash (`.is-target`), except under reduced motion.
- Example: `/library/genesis-woh/lenses/1/?lens=4#v26`.

## Motion, reduced motion, announcements

- Only cards and passage notes near the viewport animate (`.is-near`, set by
  an IntersectionObserver). Everything else switches at once.
- Motion (`.genesis--motion`) switches on only after the starting lens has
  painted, and never under `prefers-reduced-motion`. Reduced motion also stops
  the thumb slide, the band fade and the deep-link wash.
- Once the slider is stuck, the scroll position is held on the first card or
  passage note below it, so a lens change does not move the reader's place in
  the text.
- One polite live region (`#genesis-live`) announces every change, for the page
  ("Lens 3: Reading") or for a card ("1:26: Hebrew").

## Print

The state machine is screen-only, so a printed chapter shows **all four
lenses**, each with its pane label and passage title. The slider, hint,
chapter switcher, step and reset buttons and the pager are hidden. The
passage note prints open, without its icon. Translator's notes stay in the
library edition and do not print. The "Reading in preparation" lines do not
print. Passages print in full (`content-visibility: visible`), and cards
avoid page breaks.

## Lens 3: Reading pane

`pane_decoded` prints the decoded units whose first ref falls in the card,
each with its verse number (or range) and its text. The swapped words carry
**no visual marking** (founder ruling 2026-11-28), so the verse reads as one
sentence. The pane has no claim label and no canon refs. The decoding is
justified once, in the decoding glossary, not per sentence. A decoded unit
appears in the card of its first verse, so a unit should not reach into the
next card. The validator warns when one does.

## Lens 4: Meaning pane

Each card's `pane_meaning` prints:

1. a basis line: "From the Messages" (with a dot) for `basis: "canon"`, "A
   Wheel of Heaven reading" for `synthesis`;
2. the Meaning text as one labelled segment, followed by its canon refs.

In lens 4 the passage header also shows the **canon-coverage marker**, above
the cards it qualifies, driven by `passage.canonCoverage`:

- `quotes`: "The Messages quote this passage and explain it."
- `comments`: "The Messages comment on this passage."
- `alludes`: "The Messages allude to this passage."
- `silent`: "The Messages do not comment on this passage; what follows is a
  Wheel of Heaven reading." This marker has its own style
  (`.genesis-coverage--silent`).

### Passage note

`passage_note` renders under the passage's cards, in lens 4 only: a bar
"Note on this passage" with the note icon, and the folded body. The body
holds, in order:

1. **Paragraphs** of claim-labelled segments (`note.paragraphs`);
2. an optional **visual** (see below);
3. **the folded literal text**: a closed `<details class="genesis-text">`
   ("Genesis 1:1–5 · the literal text") listing the passage's layer-2 lines,
   so the note can be checked against the words it explains.

## Claim dots

Every Meaning unit and every note segment carries one of the four labels
(`direct`, `framework`, `inferred`, `speculative`). `segment` runs the text
through `markdown(inline=true)` and passes it to the shared macro:

```tera
{% import "macros/claim.html" as claim_macros %}
{{ claim_macros::inline(type=claim, text=html, lang=lang, id=core) }}
```

`macros/claim.html::inline` is the same markup the
[`claim` shortcode](@/components/shortcodes/claim.md) prints, so
`claim-notes.js` and `_claim-inline.scss` serve both. Tapping the dot opens
the one shared note: label, definition, the Method link, and the core record
when `coreClaim` is set. The macro emits one line with no surrounding
whitespace, so nothing shows between a claim and the punctuation after it.

The reader changes only one thing, scoped to `.genesis-reader .claim`: the dot
always shows, and the underline appears only on hover, on keyboard focus or
while the note is open (`claim--active`). The founder ruled that the reader
uses dots only. The shortcode's always-on underline elsewhere is unchanged.

## Canon refs

`canon_refs(canon)` prints a segment's canon references as **one quiet run**
after the sentence, in the mono face at 0.72em, with no borders, so the prose
reads through them. Consecutive paragraphs of one book are merged:
`TBWTT 2:28, 2:30 · LWTE 3:4`. Each paragraph stays its own link
(`canon_chip`), and its underline shows on hover and focus.

| Ref | Printed | Link |
|---|---|---|
| `"TBWTT-2:5"` | `TBWTT 2:5` | `/library/the-book-which-tells-the-truth/#c2p5` |
| `"ETTMTTP-2:23"` | `ETTMTTP 2:23` | `/library/extraterrestrials-took-me-to-their-planet/#c2p23` |
| `{"ref": "LWTE-1:69", "standing": "author-opinion"}` | `LWTE 1:69 opinion` | `/library/lets-welcome-the-extraterrestrials/#c1p69` |

- Each link's `aria-label` gives the full book name and paragraph. Its
  `title` is the paragraph's English text, truncated to 180 characters and
  read from `data/library/{slug}/chapter-N.json`.
- Author-opinion refs (all LWTE refs, and refs marked `author-opinion`) keep
  a **dashed** underline that stays visible. The word "opinion" is written
  once, after the last paragraph of the run. The aria-label names them as
  Raël's opinion, never as canon.
- An unknown book code renders as a plain, unlinked span.

## Visuals

A passage's `note.visual` (`{ "kind": "diagram", "ref": …, "alt": {…} }`)
renders inside the passage note through `genesis::visual`, as part of the
[diagram family](@/components/shortcodes/diagram.md):

- the SVG is inlined from `static/diagrams/{ref}.svg`;
- when `static/diagrams/{ref}-narrow.svg` exists, both are inlined and
  `.diagram--has-narrow` swaps them with the diagram shortcode's media query;
- `alt` becomes the figure's accessible name (`role="group"`, `aria-label`);
- a missing SVG renders a dashed placeholder ("Diagram … is not drawn yet")
  plus the alt as a caption, so a missing drawing is visible on the dev server.

The first visual is **`creation-week`**, in the note on Genesis 1:1–5. It
shows six day tiles in the day hues, each with its verse range, glyph and
label. Under them sits the canon's scale (each day ≈ 2,000 Earth years,
TBWTT 2:10). Below that, marked as framework, is the Wheel of Heaven model
(≈ 2,160 years, claim 0059). This keeps the canon figure ahead of the project
model. The phone variant `creation-week-narrow` lists the days vertically.
Both come from the `cw` string block in `tools/diagram-strings/en.json`. The
figure is built only where that block exists, so it is English-only for now.
Regenerate with:

```sh
python3 themes/bifrost/tools/gen_diagrams.py   # from the www repo root
```

## The index page

`genesis-section.html` renders the title, `section.extra.lede`, a "Start with
Genesis 1" link and a "How the lenses work ↓" link. The **chapters come
first**: 50 tiles in four groups (Primeval history 1–11, Abraham 12–25, Jacob
26–36, Joseph 37–50), so a phone reaches them without scrolling through the
explanation. The hand-written intro (`#genesis-about`: the four lenses, canon
first, claim labels) follows below. A tile with four lenses
(`.genesis-tile--four`) carries the rainbow on its left edge and reads "Four
lenses". The draft rule matches the chapter page.

## Anatomy

| Class | What |
|---|---|
| `.genesis--chapter` | Page root; `data-chapter`, `data-page-lens`, `.genesis--motion`, `.genesis--js` |
| `.genesis__header` / `__eyebrow` / `__meta` / `__draft` | Chapter header |
| `.genesis-jump` / `__step` / `__menu` / `__summary` / `__panel` / `__grid` / `__chapter--four` | Chapter switcher |
| `.genesis-lens` / `__track` / `__input` / `__stop` / `__thumb` / `__hint`; `--stuck` | The sticky slider and its band |
| `.genesis-passage` / `__range` / `__title` / `__cards` | One passage (title shown only in lenses 3–4) |
| `.genesis-card` / `__bar` / `__ref` / `__step` / `__step-name` / `__reset` / `__panes` | One card; `data-lens`, `data-lenses`, `data-label` |
| `.genesis-pane--1` … `--4`; `--pending` | Panes: Hebrew, Literal, Reading, Meaning |
| `.genesis-verse__heb` (`lang="he" dir="rtl"`), `__translit` (`lang="he-Latn" dir="ltr"`) | Hebrew word pairs (copied from the library reader's `render_verse`, not called, so the library reader is never touched) |
| `.genesis-verse--decoded` | One decoded unit (lens 3) |
| `.genesis-note-link` (+ `.library-book__commentary-link`) | Note icon |
| `.genesis-fold`, `.genesis-note` | Inline fold; translator's note (lens 2) |
| `.genesis-reading__basis--canon` / `--synthesis`, `.genesis-reading__text` | Meaning basis line and text |
| `.genesis-coverage--{quotes,comments,alludes,silent}` | Lens 4 canon-coverage marker |
| `.genesis-passage-note` / `__bar` / `__body` / `__para` | Passage note (lens 4) |
| `.genesis-refs` / `__sep`, `.genesis-chip` / `--opinion` | Canon refs |
| `.genesis-figure` | Passage-note visual |
| `.genesis-text` | Folded literal lines in the passage note |
| `.genesis-pending`, `.genesis-reader__pending` | "Reading in preparation" |
| `.genesis__colophon`, `.genesis__pager` | Colophon and pager |
| `.genesis-tile` / `--four` | Index tile |

## Live examples

- [/library/genesis-woh/lenses/](https://www.wheelofheaven.world/library/genesis-woh/lenses/):
  the index.
- [/library/genesis-woh/lenses/1/?lens=3](https://www.wheelofheaven.world/library/genesis-woh/lenses/1/?lens=3):
  the decoded Reading ("When the Sky People began to shape the skies and the land…").
- [/library/genesis-woh/lenses/1/?lens=4](https://www.wheelofheaven.world/library/genesis-woh/lenses/1/?lens=4):
  Meaning cards; the note on 1:1–5 holds the creation-week figure.
- [/library/genesis-woh/lenses/3/?lens=4](https://www.wheelofheaven.world/library/genesis-woh/lenses/3/?lens=4):
  silent passages (3:8–13, 3:16–20) carry the "do not comment" marker.
- [/library/genesis-woh/lenses/12/](https://www.wheelofheaven.world/library/genesis-woh/lenses/12/):
  Hebrew and Literal only, with stops 3–4 marked "coming".

## Related

- [Genesis lenses (writing pipeline)](@/contributing/content/genesis-lenses.md)
- [`claim` shortcode](@/components/shortcodes/claim.md), the same marker in prose
- [`diagram` shortcode](@/components/shortcodes/diagram.md), the visual family and narrow variants
- [Reader controls](@/components/interactive/reader-controls.md)
- [Source-Text Translation](@/contributing/content/source-text-translation/_index.md), where layer 2 comes from
