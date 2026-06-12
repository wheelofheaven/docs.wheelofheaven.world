+++
title = "Audio Play Cue Sheets"
description = "How audio production directives (scenes, SFX, pauses, voice tweaks) are scaffolded outside the source-text chapter JSONs so audio plays can iterate without polluting the library content."
template = "page.html"
weight = 46
+++

How a polished audio play gets directed without bleeding production
notes into the source text. The
[Audio Play Pipeline](@/contributing/dev/audio-play-pipeline.md) covers
the rendering side (TTS → MP3/Opus → CDN); this page covers the
**production scaffolding** that drives it.

> **Status:** designed. The cue-sheet layer is being introduced as a
> refactor over the v4 pipeline. Current behavior (scene tags inline
> in `chapter-N.json`) remains supported during migration; new
> directives (SFX, pauses, per-paragraph voice tweaks) only live in
> cue sheets.

## The problem

By the end of v4 the chapter JSON was being asked to do two jobs at
once:

1. Carry the **source text** — paragraphs, translations, refIds,
   speaker labels.
2. Carry **audio production directives** — scene tags (`elohim-vessel`),
   and eventually SFX cues, per-paragraph pauses, voice tweaks, music
   cues, fades.

A chapter JSON that's both the reading source AND the studio session
is unreadable. Editors who want to tweak the text now have to wade
through audio directives that mean nothing to them; producers who
want to tweak the audio mix have to commit changes to the text repo.
Cross-language drift makes it worse — the French chapter JSON has
the same scene tags as the English, even though scene boundaries
might not align word-for-word across translations.

## The structure

Three layers, file-system separated:

```
data-library/
  audio/                          ← global, reusable across books
    voices.yaml                   ← casting (Narrator → Phoenix, …)
    treatments.yaml               ← per-speaker EQ/reverb chains
    scenes.yaml                   ← scene id → ambient bed prompt + gain
    sfx.yaml                      ← reusable one-shot clips by id

  {slug}/                         ← per-book
    chapter-N.json                ← STAYS LEAN: text + speaker + translations
    audioplay/
      manifest.yaml               ← book-level: theme music, casting overrides, fades
      cues/
        c1.yaml                   ← per-paragraph cues for chapter 1
        c2.yaml
        ...
```

### Why this split

| Concern | Lives in | Touched by |
|---|---|---|
| Source text, translations | `chapter-N.json` | Editors, translators |
| Speaker labels (Narrator/Raël/Yahweh) | `chapter-N.json` | Editors (it's editorial, not just audio) |
| Per-paragraph scene tags | `audioplay/cues/cN.yaml` | Producers |
| SFX cues at scene boundaries | `audioplay/cues/cN.yaml` | Producers |
| Pre/post pause overrides | `audioplay/cues/cN.yaml` | Producers |
| Per-paragraph voice tweaks (stability, similarity_boost) | `audioplay/cues/cN.yaml` | Producers |
| Per-book theme music / title music | `audioplay/manifest.yaml` | Producers |
| Per-book casting overrides | `audioplay/manifest.yaml` | Producers |
| Global SFX clip library | `audio/sfx.yaml` | Producers (shared across books) |
| Scene ambient-bed definitions | `audio/scenes.yaml` | Producers (shared across books) |
| Voice cast | `audio/voices.yaml` | Producers (shared across books) |

Editors edit text. Producers edit cues. No file is owned by both.

## Paragraph kinds (editorial, in `chapter-N.json`)

Some "paragraphs" in source-text JSONs aren't body prose. The pipeline
needs to know which is which — both the audio renderer (different
cadence and pause shape) and the library book reader (different
visual rendering). The kind is editorial — it's a fact about what the
text **is**, not a production choice — so it lives in
`chapter-N.json` alongside `speaker`.

```json
{"n": 47, "kind": "title",        "i18n": {"en": "The Atomic Bombs"}}
{"n": 48, "speaker": "Yahweh",    "i18n": {"en": "Since the great explosion..."}}
{"n": 102, "speaker": "Narrator", "i18n": {"en": "By these were the nations divided..."}}
{"n": 103, "speaker": "Narrator", "kind": "continuation",
 "i18n": {"en": "Flood. (Genesis 10:32)"}}
```

| `kind`         | What it is                          | Audio render                                | Library render                |
|---|---|---|---|
| `body`         | Regular prose (default if omitted)  | Speaker reads at normal cadence, default pauses around it | Standard verse paragraph    |
| `title`        | A section header inside a chapter — e.g. "The Atomic Bombs", "Overpopulation", "The Tower of Babel" in TBWTT | Longer pre/post pause, may carry an SFX cue from the cue sheet, may read with a different cadence | Rendered as `<h3>` / styled differently from body paragraphs |
| `continuation` | Continues the immediately-prior paragraph mid-sentence (a paragraph break that exists in the source for layout, not narrative pacing) | TTS-concatenated with the previous paragraph, no inter-paragraph silence | Visually joined or rendered with a tighter spacing |

`kind` is **language-agnostic**: a section title is a section title in
every language. The field lives in the source-text chapter JSON once
and applies across all translations.

### Why `kind` isn't in the cue sheet

Cue sheets carry production directives — what the producer chooses to
do with each paragraph (add SFX, change pause, override voice). Kind
is upstream of that: it tells the producer (and the reader, and the
library renderer) what each paragraph IS. The cue sheet then says
how to PERFORM each kind.

A title paragraph might or might not get an extra SFX cue depending
on the producer's call. But it's always a title.

### Editorial pass on existing books

Existing chapter JSONs default everything to `body` (the field is
omitted on every paragraph). An editorial pass on TBWTT — the first
shipped audio play — identifies titles and continuations chapter
by chapter. A small helper script
(`data-library/scripts/scan_kinds.py`) flags candidate paragraphs:
short paragraphs without verbs that match a title vocabulary,
paragraphs that end mid-sentence followed by a paragraph that starts
with a continuation marker. Human reviews the candidates and tags
them in the chapter JSON.

## File shapes

### `audio/sfx.yaml` — reusable SFX library

```yaml
# Schema 1
clips:
  yahweh-enter:
    prompt: "deep bass synth pad swell, 2 seconds, sub-bass entrance"
    duration_seconds: 2
    description: |
      Marks a Yahweh monologue starting cold (no prior dialogue).
      Sub-bass-heavy so it pairs with the elohim-vessel hum.

  cosmic-chime:
    prompt: "single soft synth chime with reverb tail, sci-fi atmosphere"
    duration_seconds: 1.5
    description: "Light marker for paragraph transitions inside a Yahweh monologue."

  vessel-door-open:
    prompt: "metallic spacecraft door sliding open with subtle pneumatic hiss"
    duration_seconds: 1.2

  silence-1s:
    # Special-case: forces a clean 1s of silence at the cue point. Useful
    # when you want a beat without an audible event.
    prompt: ""
    duration_seconds: 1
```

Each entry is generated **once** via the ElevenLabs
`/v1/sound-generation` endpoint and cached at
`data-library/audio/_work/_sfx/{hash}.mp3`. Subsequent re-renders
across any book or chapter reuse the cached clip for free.

### `audioplay/manifest.yaml` — book-level config

```yaml
# Schema 1
book: the-book-which-tells-the-truth

# Per-book casting overrides. Empty → use audio/voices.yaml defaults.
# Useful when a book wants a different Yahweh voice than the global cast.
casting:
  en:
    # Yahweh: <voice_id>   # leave commented to inherit global
  fr:
    # Yahweh: <voice_id>

# Per-book treatment overrides — same shape as audio/treatments.yaml.
# Use sparingly: a book that wants a heavier reverb on Yahweh's voice
# specifically can override here without affecting other books.
treatments_override: {}

# Title music — optional clip played at chapter 1's start and possibly
# at chapter ends. Pulled from sfx.yaml by id.
title_music:
  cue: book-title-tbwtt           # ref into sfx.yaml; create the entry there
  gain_db: -8
  fade_in_ms: 1500
  fade_out_ms: 2000

# Audio Play Intro — a scripted opener that runs BEFORE chapter 1's
# first paragraph. NOT part of the source text. The intro narrator is
# a separate voice cast (AudioplayNarrator) from any in-text speaker —
# they sit outside the audio play's fictional frame and tell the
# listener what's about to happen.
#
# In TBWTT specifically: the in-text "Narrator" is Raël himself,
# writing after the fact from his perspective as author. The intro
# narrator is a neutral voice OUTSIDE that frame who explains the
# setup to the listener (who Raël is, when the encounters happened,
# what the listener will hear, who's who in the cast).
intro:
  speaker: AudioplayNarrator      # cast in audio/voices.yaml
  text: |
    The Book Which Tells the Truth is a 1973 work by Raël — a French
    journalist and racing-car driver who, in December 1973, reports
    a series of encounters with an extraterrestrial being named
    Yahweh. Over six days, Yahweh teaches him the true origin of
    humanity, the meaning of the major world religions, and the
    role he is being asked to play.

    Raël wrote down what he heard, in his own voice, after the
    encounters ended. You will hear three voices in this audio
    play: Raël speaking as the narrator from his author's chair,
    looking back; Raël speaking inside the encounters, asking
    questions in real time; and Yahweh, teaching. Yahweh's voice
    carries a subtle hall reverb to mark his off-world origin.
  pre_pause_ms: 1000              # silence before intro starts
  post_pause_ms: 2000              # silence after intro, before chapter 1 p1
  ambient_under: book-overture     # optional sfx.yaml id playing under intro

# Default scene transition crossfade. Cues can override per-chapter.
default_scene_fade_ms: 300

# Default pre/post-paragraph silences when not overridden by cues.
# Mirrors audio/voices.yaml defaults but per-book.
default_pause_ms_between_paragraphs: 600
default_pause_ms_between_speakers: 900
```

### The voice cast for an audio play

For a book like TBWTT, four cast roles emerge — three in-text plus
one outside-the-frame:

| Role                  | Who they are                                                          | Voice (decided 2026-06)  | Where cast      |
|---|---|---|---|
| `Narrator`            | The in-text narrator — Raël writing after the fact, looking back     | Phoenix (`aaHNjm7ksE1iw31dNOq5`) | `audio/voices.yaml` + per-paragraph in `chapter-N.json` |
| `Raël`                | Raël inside the encounters, asking questions in real time            | Phoenix (same voice, different prosody defaults) | `audio/voices.yaml` |
| `Yahweh`              | The off-world teacher                                                  | Jon — Natural Authority (`sB7vwSCyX0tQmU24cW2C`) | `audio/voices.yaml` |
| `AudioplayNarrator`   | The neutral outside-the-frame voice that delivers the intro and any  outro / chapter prefaces | Jarnathan — Confident and Versatile (`c6SfcYrb2t09NHXiT80T`) | `audio/voices.yaml` (per-language) |

`AudioplayNarrator` uses its own voice ID per language (the intro is
scripted English in EN, scripted French in FR, etc. — the text gets
translated and re-rendered). **Jarnathan is the project-wide neutral
Wheel of Heaven voice**: any future non-book audio (metadata readers,
announcements, site-level audio) should reuse it so the "voice of the
site" stays consistent across projects.

In TBWTT, `Narrator` and `Raël` share a voice deliberately (it's the
same person, just from different temporal vantage points) — both cast
to Phoenix, differentiated only by prosody defaults (stability 0.55
vs 0.60). Phoenix replaced the original Marcel casting after listener
feedback flagged the French accent. If a future production wants to
differentiate the two roles further, that's a per-role casting
override in `audio/voices.yaml`, no schema change needed.

### `audioplay/cues/cN.yaml` — per-chapter cue sheet

```yaml
# Schema 1
chapter: 1

# Sparse — paragraphs not listed inherit defaults (speaker change
# silences from manifest.yaml, no SFX, no scene). Each entry is keyed
# by paragraph number (matches chapter-N.json's paragraphs[].n).
cues:
  - paragraph: 9
    # Scene tag. Persists until another cue changes it or sets "".
    scene: elohim-vessel
    # Extra silence before this paragraph's audio (in addition to the
    # default speaker-change pause).
    pre_pause_ms: 1500
    # One-shot SFX mixed in at the paragraph's onset.
    sfx_at_start:
      - id: yahweh-enter       # ref into audio/sfx.yaml
        gain_db: -10            # local override on top of sfx default
      - id: vessel-door-open
        gain_db: -14
        offset_ms: 400          # play 400ms after paragraph starts
    # Per-paragraph voice tweaks — applied on top of voices.yaml +
    # treatments.yaml for this paragraph only.
    voice_override:
      stability: 0.9            # extra-stable for the opening line

  - paragraph: 42
    sfx_at_start:
      - id: cosmic-chime
        gain_db: -12

  - paragraph: 64
    scene: ""                   # explicit scene end
    post_pause_ms: 2000         # long silence before next paragraph
```

### Migration: `chapter-N.json` scene tags

The v4 implementation put scene tags inline on paragraphs in
`chapter-N.json`:

```json
{"n": 9, "speaker": "Yahweh", "scene": "elohim-vessel", ...}
```

These get **moved out** to `cN.yaml`:

```yaml
cues:
  - paragraph: 9
    scene: elohim-vessel
```

The generator reads cue sheets first; falls back to the chapter JSON's
`scene` field if no cue sheet exists for that paragraph. Migration is
incremental — convert one chapter at a time, delete the `scene` field
from the chapter JSON once the cue sheet is in place.

Speaker labels stay in `chapter-N.json` — they're editorial (who is
speaking IS part of the source text), not production-only.

## How the renderer reads it

Top-level orchestrator:

```sh
python3 data-library/scripts/render_audioplay.py \
    --slug the-book-which-tells-the-truth --lang en --chapter 1
```

Internally, the orchestrator:

1. Loads `audio/voices.yaml` → base casting
2. Loads `audio/treatments.yaml` → base per-speaker EQ/reverb
3. Loads `audio/scenes.yaml` → scene id → ambient bed mapping
4. Loads `audio/sfx.yaml` → SFX clip registry
5. Loads `{slug}/audioplay/manifest.yaml` → book-level overrides
6. Loads `{slug}/audioplay/cues/c{N}.yaml` → per-paragraph cues
7. Loads `{slug}/chapter-{N}.json` → source text + speakers
8. Loads `{slug}/tts/chapter-{N}.{lang}.json` → TTS-normalised text
9. For each paragraph:
   - Resolve voice (casting + per-book override + per-paragraph
     voice_override)
   - Render TTS (with the existing per-paragraph cache key —
     unchanged from v2)
   - Apply per-speaker treatment (v3)
   - Apply per-paragraph voice_override at treatment time
10. Concat paragraphs with pauses (default OR cue override OR
    cue-set pre/post offsets)
11. Build ambient track from scene spans (using cue scene tags;
    falls back to chapter JSON scene if no cue)
12. Build SFX track from `sfx_at_start` cues — generate each clip
    via ElevenLabs sound-gen (cached), mix at the paragraph's
    onset + offset_ms
13. Mix ambient + SFX into `c{N}.ambient.opus`
14. Write `c{N}.mp3` + `c{N}.opus` + `c{N}.timing.json` +
    `c{N}.ambient.opus` to the assets repo
15. Update `manifest.json`

The existing `generate_audio.py` and `generate_ambient.py` keep
running as-is for backward compatibility; the new
`render_audioplay.py` wraps both and adds the cue-sheet
indirection layer.

## Operational loop

```
edit audioplay/cues/c3.yaml          ← producer changes a cue
  ↓
python3 scripts/render_audioplay.py --slug tbwtt --lang en --chapter 3
  ↓
listen → assets/audio/en/tbwtt/c3.mp3 (etc.)
  ↓
tweak cue sheet
  ↓
re-render (cached: only changed paragraphs/SFX re-bill the API)
```

## What this gives you

- **Add a single SFX** → edit one YAML line in a cue sheet, re-render
  that chapter. Cost: one ElevenLabs sound-gen call (~$0.08) if the
  SFX prompt is new; free if it's an existing `id` from `sfx.yaml`.
- **Reuse SFX across books** → reference the same id from any cue
  sheet in any book.
- **Try a different cue without touching text** → cue sheets and
  chapter JSONs are independent. Editors don't see the cue work; producers
  don't see the editorial flow.
- **Per-book theme music** without polluting global defaults.
- **Per-paragraph voice tweaks** for moments that need them (the very
  first line of a Yahweh monologue could ride at higher stability for
  declarative gravity; a Raël question could ride lower stability for
  more expressive uncertainty). No re-billing if cached.
- **Multi-book scaling** → each book gets its own `audioplay/`
  directory; the global `audio/` library scales linearly.

## What it does NOT give you (yet)

- **Cross-language cue alignment** — cue sheets are scoped to the
  book, not the language. A scene that starts at paragraph 9 in EN
  starts at paragraph 9 in every language. If a translation
  significantly reorganises paragraphs, the cues drift. Not a
  problem today (TBWTT preserves paragraph structure across all 9
  languages); will become one if a future book uses translation
  flexibility.
- **Time-based cues** — cues are paragraph-indexed, not
  second-indexed. Music swells that need to land at second 47.5 of
  paragraph 9 can't yet be expressed. Add `time_offset_seconds` to
  the cue schema if/when needed.
- **Multi-track mixing UI** — the cue sheet IS the multi-track
  session. No DAW import/export yet. If audio play production ever
  scales to needing a producer DAW workflow, the cue sheet → Reaper
  RPP / Pro Tools session conversion is straightforward but unbuilt.
- **Live monitoring** — render is batch. No live "scrub through the
  cue sheet and hear what it sounds like at each cue" surface. The
  existing per-paragraph cache makes the batch loop fast enough that
  this hasn't been a pain point.

## Rollout plan

**Phase 1 — Refactor (no audible change):**

1. Create `data-library/audio/sfx.yaml` (empty registry, schema doc'd).
2. Create `data-library/the-book-which-tells-the-truth/audioplay/manifest.yaml`
   (book defaults; no intro yet, just paving the path).
3. Create `data-library/the-book-which-tells-the-truth/audioplay/cues/c1.yaml`
   through `c7.yaml`, moving the v4 `scene: elohim-vessel` tags out of
   the chapter JSONs.
4. Update `generate_ambient.py` to read cues first, fall back to
   chapter JSON `scene` field for unconverted chapters/books.
5. Re-render TBWTT EN — output byte-identical to the pre-refactor build.

**Phase 2 — Paragraph kinds:**

1. Add `kind: body | title | continuation` to the chapter-JSON schema
   (documented in [Library Book Format](@/reference/library-book-format.md)).
2. Write `data-library/scripts/scan_kinds.py` — surfaces candidate
   titles (short paragraphs without verbs, matching a title vocabulary)
   and candidate continuations (paragraphs ending mid-sentence, followed
   by a paragraph beginning with a continuation marker) across all
   chapters of a book.
3. Human editorial review — apply `kind` tags to TBWTT chapter JSONs
   (one-shot, applies across all 9 languages since `kind` is
   language-agnostic).
4. Update `generate_audio.py` to treat kinds specially:
   - `title` → longer pre/post pause; ignores speaker label (an
     `AudioplayNarrator` reads titles by default, unless the cue sheet
     overrides)
   - `continuation` → concatenated with previous paragraph's TTS, no
     inter-paragraph silence, gets a single combined timing-sidecar
     entry
   - `body` (default) → unchanged from today
5. Update Bifrost's library macros so the reader page renders
   `kind: title` as `<h3>` (visual heading) and `kind: continuation`
   with tighter spacing — see `themes/bifrost/templates/macros/library.html`.
6. Re-render TBWTT EN.

**Phase 3 — Audio Play Intro (`AudioplayNarrator`):**

1. Cast an `AudioplayNarrator` voice per-language in `audio/voices.yaml`
   — a neutral outside-the-frame voice that won't conflict with the
   in-text Narrator / Raël voice.
2. Write the intro script in `audioplay/manifest.yaml`'s `intro.text`
   for the canonical language; translate when shipping in others.
3. Render the intro as a special "p0" clip prepended to chapter 1's
   timing + audio.
4. Update the bifrost player to highlight the intro region (or not —
   intro is unhighlighted prose).

**Phase 4 — First SFX:**

1. Add a small set of SFX entries to `audio/sfx.yaml` (yahweh-enter,
   cosmic-chime, vessel-door-open — start with 3–5).
2. Add `sfx_at_start` cues to TBWTT EN's cue sheets at meaningful
   moments (Yahweh's first entrance, title transitions, etc.).
3. Update `generate_ambient.py` (or the new `render_audioplay.py`)
   to emit the SFX layer mixed under the voice track.
4. ~$1 total ElevenLabs sound-gen spend for the SFX palette.

**Phase 5 — Top-level orchestrator:**

1. Build `render_audioplay.py` as the new top-level entry point.
2. Deprecate direct invocation of `generate_audio.py` /
   `generate_ambient.py` (keep them as library functions).
3. Add the `pre_pause_ms` / `post_pause_ms` / `voice_override`
   per-paragraph directives.

**Phase 6 — Theme music:**

1. Add `title_music` support to `manifest.yaml` interpretation.
2. Generate per-book title music clips.
3. Mix at chapter 1 head + per-chapter outro (optional).

Each phase ships independently; no phase locks in commitments
beyond itself.

## Related

- [Audio Play Pipeline](@/contributing/dev/audio-play-pipeline.md) —
  the v1→v4 rendering chain that this scaffolding sits on top of.
- [Library Book Format](@/reference/library-book-format.md) —
  what `chapter-N.json` looks like today.
