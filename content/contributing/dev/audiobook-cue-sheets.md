+++
title = "Audiobook Cue Sheets"
description = "How audio production directives (scenes, SFX, pauses, voice tweaks) are scaffolded outside the source-text chapter JSONs so audiobooks can iterate without polluting the library content."
template = "page.html"
weight = 46
+++

How a polished audiobook gets directed without bleeding production
notes into the source text. The
[Audiobook Pipeline](@/contributing/dev/audiobook-pipeline.md) covers
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
    voices.yaml                   ← casting (Narrator → Marcel, …)
    treatments.yaml               ← per-speaker EQ/reverb chains
    scenes.yaml                   ← scene id → ambient bed prompt + gain
    sfx.yaml                      ← reusable one-shot clips by id

  {slug}/                         ← per-book
    chapter-N.json                ← STAYS LEAN: text + speaker + translations
    audiobook/
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
| Per-paragraph scene tags | `audiobook/cues/cN.yaml` | Producers |
| SFX cues at scene boundaries | `audiobook/cues/cN.yaml` | Producers |
| Pre/post pause overrides | `audiobook/cues/cN.yaml` | Producers |
| Per-paragraph voice tweaks (stability, similarity_boost) | `audiobook/cues/cN.yaml` | Producers |
| Per-book theme music / title music | `audiobook/manifest.yaml` | Producers |
| Per-book casting overrides | `audiobook/manifest.yaml` | Producers |
| Global SFX clip library | `audio/sfx.yaml` | Producers (shared across books) |
| Scene ambient-bed definitions | `audio/scenes.yaml` | Producers (shared across books) |
| Voice cast | `audio/voices.yaml` | Producers (shared across books) |

Editors edit text. Producers edit cues. No file is owned by both.

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

### `audiobook/manifest.yaml` — book-level config

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

# Default scene transition crossfade. Cues can override per-chapter.
default_scene_fade_ms: 300

# Default pre/post-paragraph silences when not overridden by cues.
# Mirrors audio/voices.yaml defaults but per-book.
default_pause_ms_between_paragraphs: 600
default_pause_ms_between_speakers: 900
```

### `audiobook/cues/cN.yaml` — per-chapter cue sheet

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
python3 data-library/scripts/render_audiobook.py \
    --slug the-book-which-tells-the-truth --lang en --chapter 1
```

Internally, the orchestrator:

1. Loads `audio/voices.yaml` → base casting
2. Loads `audio/treatments.yaml` → base per-speaker EQ/reverb
3. Loads `audio/scenes.yaml` → scene id → ambient bed mapping
4. Loads `audio/sfx.yaml` → SFX clip registry
5. Loads `{slug}/audiobook/manifest.yaml` → book-level overrides
6. Loads `{slug}/audiobook/cues/c{N}.yaml` → per-paragraph cues
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
`render_audiobook.py` wraps both and adds the cue-sheet
indirection layer.

## Operational loop

```
edit audiobook/cues/c3.yaml          ← producer changes a cue
  ↓
python3 scripts/render_audiobook.py --slug tbwtt --lang en --chapter 3
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
- **Multi-book scaling** → each book gets its own `audiobook/`
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
  session. No DAW import/export yet. If audiobook production ever
  scales to needing a producer DAW workflow, the cue sheet → Reaper
  RPP / Pro Tools session conversion is straightforward but unbuilt.
- **Live monitoring** — render is batch. No live "scrub through the
  cue sheet and hear what it sounds like at each cue" surface. The
  existing per-paragraph cache makes the batch loop fast enough that
  this hasn't been a pain point.

## Rollout plan

**Phase 1 (refactor, no audible change):**

1. Create `data-library/audio/sfx.yaml` (empty registry, schema doc'd)
2. Create `data-library/the-book-which-tells-the-truth/audiobook/manifest.yaml`
3. Create `data-library/the-book-which-tells-the-truth/audiobook/cues/c1.yaml`
   through `c7.yaml`, moving the v4 `scene: elohim-vessel` tags out of
   the chapter JSONs
4. Update `generate_ambient.py` to read cues first, fall back to
   chapter JSON `scene` field for unconverted chapters/books
5. Re-render TBWTT EN — output should be byte-identical to the
   pre-refactor build

**Phase 2 (first SFX):**

1. Add a small set of SFX entries to `audio/sfx.yaml` (yahweh-enter,
   cosmic-chime, vessel-door-open — start with 3-5)
2. Add `sfx_at_start` cues to TBWTT EN's cue sheets at meaningful
   moments (Yahweh's first entrance, scene transitions, etc.)
3. Update `generate_ambient.py` (or new `render_audiobook.py`) to
   emit the SFX layer mixed under the voice track
4. ~$1 total ElevenLabs sound-gen spend for the SFX palette

**Phase 3 (top-level orchestrator):**

1. Build `render_audiobook.py` as the new top-level entry point
2. Deprecate direct invocation of `generate_audio.py` /
   `generate_ambient.py` (keep them as library functions)
3. Add the `pre_pause_ms` / `post_pause_ms` / `voice_override`
   per-paragraph directives

**Phase 4 (theme music):**

1. Add `title_music` support to `manifest.yaml` interpretation
2. Generate per-book title music clips
3. Mix at chapter 1 head + per-chapter outro (optional)

Each phase ships independently; no phase locks in commitments
beyond itself.

## Related

- [Audiobook Pipeline](@/contributing/dev/audiobook-pipeline.md) —
  the v1→v4 rendering chain that this scaffolding sits on top of.
- [Library Book Format](@/reference/library-book-format.md) —
  what `chapter-N.json` looks like today.
