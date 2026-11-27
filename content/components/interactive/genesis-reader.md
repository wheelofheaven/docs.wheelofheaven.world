+++
title = "Genesis four-lens reader (/genesis/)"
description = "The /genesis/ reader: every verse of Genesis in four lenses (Hebrew, Literal, Reading, Meaning), one sticky 4-stop slider, per-verse stepping, claim dots, canon chips and draft gating."
template = "page.html"
weight = 92
+++

The Genesis reader at
[/genesis/](https://www.wheelofheaven.world/genesis/) shows each verse of
Genesis in **four lenses**. One sticky slider switches every verse at once,
and a single verse can be stepped through the lenses on its own. Launched on
2026-11-27 with Genesis 1–3 in all four lenses. Chapters 4–50 show lenses 1–2,
and lenses 3–4 are marked as coming.

| Lens | Name | Source | Unit |
|---|---|---|---|
| 1 | **Hebrew** | Masoretic text, a transliteration under each word (`genesis-woh/chapter-N.json`, layer 1) | verse |
| 2 | **Literal** | The Wheel of Heaven literal translation (`genesis-woh/chapter-N.json`, layer 2), with its translator's note folded beneath | verse |
| 3 | **Reading** | The passage retold in the third person as the Messages read it (`genesis-woh/lenses/chapter-N.json`, layer 3) | reading unit (usually one verse) |
| 4 | **Meaning** | A plain explanation of the whole passage (lens file, layer 4) | passage |

Every chapter opens on **lens 2**. Interpretation stays out of lenses 1–2.
Passage titles, canon chips and claim labels appear only in the Reading and
Meaning panes.

**Source** (all in [`wheelofheaven/bifrost`](https://github.com/wheelofheaven/bifrost)):

- [`templates/genesis-section.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/genesis-section.html) is the index: intro plus 50 chapter tiles in four groups.
- [`templates/genesis-chapter.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/genesis-chapter.html) is one chapter. It loads the data, gates drafts and renders the slider, passages, live region and pager.
- [`templates/macros/genesis.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/genesis.html) holds `lens_slider`, `passage`, `lens_card`, `pane_original`, `pane_literal`, `pane_reading`, `explanation`, `segment`, `canon_chip` and `visual`.
- [`templates/macros/claim.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/claim.html) is the inline claim marker, shared with the [`claim` shortcode](@/components/shortcodes/claim.md).
- [`templates/partials/schema/genesis-chapter.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/schema/genesis-chapter.html) is the `Chapter` JSON-LD, `isPartOf` the Genesis-WoH `Book`.
- [`sass/pages/_genesis-reader.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/pages/_genesis-reader.scss) holds the lens state machine, motion and print. `.genesis` and `.genesis__intro` are in the `_grammar.scss` page lists.
- [`static/js/genesis-lens.js`](https://github.com/wheelofheaven/bifrost/blob/main/static/js/genesis-lens.js) is bundled by `scripts/bundle.js` into `js/dist/genesis.bundle.js`. Only `genesis-chapter.html` loads it, not the core bundle.
- [`tools/gen_diagrams.py`](https://github.com/wheelofheaven/bifrost/blob/main/tools/gen_diagrams.py) builds `creation-week` and `creation-week-narrow`.

The chapter stubs and the lens data are covered on the contributing side:
[Genesis lenses (writing pipeline)](@/contributing/content/genesis-lenses.md).

## Data flow

```
data/library/genesis-woh/chapter-N.json          lenses 1–2 (always present)
data/library/genesis-woh/lenses/chapter-N.json   lenses 3–4 (optional)
content/genesis/N.md                             generated stub: frontmatter only
content/genesis/_index.md                        hand-written intro (genesis-section.html)
```

`data/library` is the `data-library` submodule of the www repo, and
`content` is the `data-content` submodule. The stub carries `chapter`,
`chapter_title`, `verses`, `group` and `group_name`. The template renders
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
how far the lens file has got, and its index tile reads "Four lenses · draft".
In production the same chapter renders as lenses 1–2, and its tile reads
"Hebrew + literal".

Without a rendered lens file:

- slider stops 3–4 are `disabled` and labelled "coming";
- each verse is its own card, offering lenses 1–2 only;
- the hint line says Reading and Meaning are written for chapters 1–11 first.

## The slider

`genesis::lens_slider(has_lenses, chapter)` renders a `<form>` holding a
`fieldset role="radiogroup"` of **four radios** (`name="genesis-lens"`,
`value` 1–4, lens 2 `checked`). The radios stay in the accessibility tree and
the tab order, and arrow keys move between stops natively. The visible
`label.genesis-lens__stop` pills sit over an ink thumb that slides with
`--lens-i`.

- **Sticky** under the navbar (`top: 5.25rem`, `4.5rem` below 1024px). On
  phones the navbar hides on scroll down, and the slider moves up to `0.75rem`
  by changing `top`, not by a transform, so no glass sits under a transformed
  ancestor. See the
  [glass invariants](@/contributing/dev/bifrost-theme.md#glassmorphism-invariants).
- Every stop is a 44px target. The stop numbers hide below 480px.
- **Keys 1–4** set the page lens. They are ignored with a modifier key,
  while typing in a field, while the search modal is open, and for a disabled
  stop. The "Keys 1–4" hint hides on `hover: none` devices.

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
and `opacity`. In lens 4 the verse cards fold away and each passage's
`.genesis-explanation` opens. The whole state machine sits under
`@media screen`.

### Per-verse step

Each card has a gutter bar: the verse reference (a `#vN` link), a **step**
arrow and a **reset** button, all 44px. Both buttons ship `hidden`; the JS
reveals the step arrow. Stepping cycles that card through the lenses a card
can show (1→2→3, or 1→2 without a lens file) by setting `data-lens` on the
card. Lens 4 is passage-level, so a card never steps into it. Reset ("Back to
the page lens") clears the card's own lens. Moving the page slider resets
every card.

### URL, memory, deep links

- `?lens=N` is written with `history.replaceState`, and the `#vN` hash is kept.
  Lens 2 removes the parameter.
- The choice is remembered in `localStorage` under `woh-genesis-lens`,
  wrapped in try/catch so blocked storage still works. On load the order is
  URL, then stored value, then 2. The starting lens is not stored, so a chapter
  without a lens file clamps to 2 without overwriting a remembered 3.
- `#vN` anchors sit at the top of each card. A multi-verse card carries one
  extra anchor per verse it covers. In lens 4 the card is folded, so the link
  lands on its passage's Meaning instead. Passages use
  `content-visibility: auto`, so the script re-aims for a few frames and again
  after web fonts load, and stops as soon as the reader scrolls.
- Example: `/genesis/1/?lens=4#v26`.

### Motion, reduced motion, announcements

- Only cards and Meaning panes near the viewport animate (`.is-near`, set by an
  IntersectionObserver). Everything else switches at once.
- Motion (`.genesis--motion`) switches on only after the starting lens has
  painted, and never under `prefers-reduced-motion`. Reduced motion also stops
  the thumb slide and the deep-link highlight.
- Once the slider is stuck, the scroll position is held on the first card below
  it, so a lens change does not move the reader's place in the text.
- One polite live region (`#genesis-live`) announces every change, for the page
  ("Lens 3: Reading") or for a card ("1:26: Hebrew").

### Print

The state machine is screen-only, so a printed chapter shows **all four
lenses**, each with its pane label and passage title. The slider, hint, step
and reset buttons and the pager are hidden. Passages print in full
(`content-visibility: visible`), cards avoid page breaks, and translator's
notes stay in the library edition.

## Lens 3: Reading pane

`pane_reading` prints a basis line ("From the Messages" for
`basis: "canon"`, "A Wheel of Heaven reading" for `synthesis`), then the
reading text as one labelled segment with its canon chips.

## Lens 4: Meaning pane

`explanation` renders, in order:

1. **Canon-coverage marker**, driven by `passage.canonCoverage`:
   - `quotes`: "The Messages quote this passage and explain it."
   - `comments`: "The Messages comment on this passage."
   - `alludes`: "The Messages allude to this passage."
   - `silent`: "The Messages do not comment on this passage; what follows is a
     Wheel of Heaven reading." This marker has its own style
     (`.genesis-coverage--silent`).
2. **Paragraphs** of claim-labelled segments.
3. An optional **visual** (see below).
4. **The folded literal text**: a closed `<details class="genesis-text">`
   ("Genesis 1:1–5 · the literal text") listing the passage's layer-2 lines, so
   the explanation can be checked against the words it explains.

## Claim dots

Every reading and every segment carries one of the four labels (`direct`,
`framework`, `inferred`, `speculative`). `segment` runs the text through
`markdown(inline=true)` and passes it to the shared macro:

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

## Canon chips

`canon_chip(ref)` turns a canon reference into a small pill linking into the
library reader at the cited paragraph:

| Ref | Chip | Link |
|---|---|---|
| `"TBWTT-2:5"` | `TBWTT 2:5` | `/library/the-book-which-tells-the-truth/#c2p5` |
| `"ETTMTTP-2:23"` | `ETTMTTP 2:23` | `/library/extraterrestrials-took-me-to-their-planet/#c2p23` |
| `{"ref": "LWTE-1:69", "standing": "author-opinion"}` | `LWTE 1:69 · opinion` | `/library/lets-welcome-the-extraterrestrials/#c1p69` |

The chip's `title` is the paragraph's English text, truncated to 180
characters and read from `data/library/{slug}/chapter-N.json`. Author-opinion
chips (all LWTE refs, and refs marked `author-opinion`) get a **dashed** border
and an aria-label that names them as the author's opinion, never as canon. An
unknown book code renders as a plain, unlinked span.

## Visuals

A passage's `explanation.visual` (`{ "kind": "diagram", "ref": …, "alt": {…} }`)
renders in the **Meaning** pane through `genesis::visual`, as part of the
[diagram family](@/components/shortcodes/diagram.md):

- the SVG is inlined from `static/diagrams/{ref}.svg`;
- when `static/diagrams/{ref}-narrow.svg` exists, both are inlined and
  `.diagram--has-narrow` swaps them with the diagram shortcode's media query;
- `alt` becomes the figure's accessible name (`role="group"`, `aria-label`);
- a missing SVG renders a dashed placeholder ("Diagram … is not drawn yet")
  plus the alt as a caption, so a missing drawing is visible on the dev server.

The first visual is **`creation-week`** at Genesis 1:1–5. It shows six day
tiles in the day hues, each with its verse range, glyph and label. Under them
sits the canon's scale (each day ≈ 2,000 Earth years, TBWTT 2:10). Below
that, marked as framework, is the Wheel of Heaven model (≈ 2,160 years, claim
0059). This keeps the canon figure ahead of the project model. The phone
variant `creation-week-narrow` lists the days vertically. Both come from the
`cw` string block in `tools/diagram-strings/en.json`. The figure is built only
where that block exists, so it is English-only for now. Regenerate with:

```sh
python3 themes/bifrost/tools/gen_diagrams.py   # from the www repo root
```

## The index page

`genesis-section.html` renders `section.extra.lede`, the hand-written intro
(the four lenses, canon first, claim labels), then 50 tiles in four groups:
Primeval history 1–11, Abraham 12–25, Jacob 26–36 and Joseph 37–50. A tile
with four lenses (`.genesis-tile--four`) carries the rainbow on its left edge.
The draft rule matches the chapter page.

## Anatomy

| Class | What |
|---|---|
| `.genesis--chapter` | Page root; `data-chapter`, `data-page-lens`, `.genesis--motion` |
| `.genesis-lens` / `__track` / `__input` / `__stop` / `__thumb` / `__hint` | The sticky slider |
| `.genesis-passage` / `__range` / `__title` / `__cards` | One passage (title shown only in lenses 3–4) |
| `.genesis-card` / `__bar` / `__ref` / `__step` / `__reset` / `__panes` | One reading unit; `data-lens`, `data-lenses`, `data-label` |
| `.genesis-pane--1` … `--4` | Panes: Hebrew, Literal, Reading, Meaning |
| `.genesis-verse__heb` (`lang="he" dir="rtl"`), `__translit` (`lang="he-Latn" dir="ltr"`) | Hebrew word pairs (copied from the library reader's `render_verse`, not called, so the library reader is never touched) |
| `.genesis-note` | Translator's note (lens 2) |
| `.genesis-reading__basis--canon` / `--synthesis` | Lens 3 basis line |
| `.genesis-coverage--{quotes,comments,alludes,silent}` | Lens 4 canon-coverage marker |
| `.genesis-chip` / `--opinion` | Canon chip |
| `.genesis-figure` | Lens 4 visual |
| `.genesis-text` | Lens 4 folded literal lines |
| `.genesis-tile` / `--four` | Index tile |

## Live examples

- [/genesis/](https://www.wheelofheaven.world/genesis/): the index.
- [/genesis/1/](https://www.wheelofheaven.world/genesis/1/): four lenses, with
  the creation-week figure in lens 4 of 1:1–5.
- [/genesis/3/?lens=4](https://www.wheelofheaven.world/genesis/3/?lens=4):
  silent passages (3:8–13, 3:16–20) carry the "do not comment" marker.
- [/genesis/12/](https://www.wheelofheaven.world/genesis/12/): Hebrew and
  Literal only, with stops 3–4 marked "coming".

## Related

- [Genesis lenses (writing pipeline)](@/contributing/content/genesis-lenses.md)
- [`claim` shortcode](@/components/shortcodes/claim.md), the same marker in prose
- [`diagram` shortcode](@/components/shortcodes/diagram.md), the visual family and narrow variants
- [Reader controls](@/components/interactive/reader-controls.md)
- [Source-Text Translation](@/contributing/content/source-text-translation/_index.md), where layer 2 comes from
