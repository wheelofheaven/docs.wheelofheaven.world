+++
title = "Cinematic Audiobook"
description = "The cinematic view + YouTube video export: one timeline model, two renderers (web + ffmpeg), built on top of the audio-play pipeline."
template = "page.html"
weight = 47
+++

The cinematic audiobook turns a prerecorded audio play into a film-like
experience: pre-rendered scene images play as a slideshow behind the current
sentence, rendered as a caption. It exists in **two renderers that share one
timeline model**, so they look the same:

- a **web cinematic view** — a fullscreen mode in the bifrost player, and
- an **offline ffmpeg compositor** — a deterministic, YouTube-ready MP4 per
  chapter per language.

It sits on top of the [Audio Play Pipeline](@/contributing/dev/audio-play-pipeline.md)
(which produces the audio + word timing) and the
[Audio Play Cue Sheets](@/contributing/dev/audio-play-cue-sheets.md) (which mark
which scene plays when). It adds **no new playback system** — the web view is a
second consumer of the prerecorded engine's existing clock.

## Architecture

```mermaid
flowchart LR
    timing["c{N}.timing.json<br/><i>word/paragraph timing</i>"]
    cues["audioplay/cues/c{N}.yaml<br/><i>scene shot list</i>"]
    bt["build_timeline.py"]
    cj["c{N}.cinematic.json<br/><i>scenes[] + captions[]</i>"]
    art["images/cinematic/{slug}/*.jpg<br/><i>scene stills</i>"]
    spec["style/&lt;id&gt;.json<br/><i>render spec</i>"]
    web["Web cinematic view<br/><i>bifrost listen-button.js</i>"]
    comp["compose_video.py<br/><i>ffmpeg</i>"]
    mp4["c{N}.{lang}.mp4"]

    timing --> bt
    cues --> bt
    bt --> cj
    cj --> web
    cj --> comp
    art --> web
    art --> comp
    spec --> web
    spec --> comp
    comp --> mp4
```

The pipeline lives in `data-cinematics/audiobook/`. The key idea: **derive one
data model, render it two ways.** The render spec is the single source of truth
for typography, safe-area, fades, and Ken-Burns motion, so the video matches
the web view without screen-capture.

## The timeline model — `c{N}.cinematic.json`

`build_timeline.py` derives a per-chapter JSON that both renderers consume. It
is written next to the audio at
`assets.wheelofheaven.world/audio/{lang}/{slug}/c{N}.cinematic.json` and
fetched client-side like `timing.json`.

```jsonc
{
  "book": "the-book-which-tells-the-truth",
  "lang": "en", "chapter": 1, "duration_seconds": 780.737,
  "scenes": [
    { "scene": "elohim-vessel", "image": "elohim-vessel",
      "start": 179.04, "end": 270.29 }
  ],
  "captions": [
    { "text": "The Book Which Tells the Truth, by Raël.",
      "start": 1.0, "end": 3.39,
      "speaker": "AudioplayNarrator", "kind": "intro", "paragraph": 0,
      "words": [ { "w": "The", "start": 1.0, "end": 1.15 } ] }
  ]
}
```

- **`scenes[]`** — a continuous, gap-filled, non-overlapping track over the
  whole chapter. Cue paragraph numbers (which equal `timing.json` paragraph
  `n`) are converted to times; a scene runs until the next cue. Segments with
  no cue become `scene: "default"`, `image: null`. Adjacent identical scenes
  merge.
- **`captions[]`** — sentences split from the word stream (so each caption's
  `start`/`end` fall out of its first/last word). `words[]` is retained so
  word-level karaoke highlight can be added later without a rebuild.

## Phase 0 — building the timeline

`build_timeline.py` needs no API and no images. It is fast and idempotent.

```sh
cd data-cinematics/audiobook
mise run timeline                 # default book, EN, all chapters
python3 build_timeline.py --book <slug> --lang en --chapters 1
python3 build_timeline.py --book <slug> --all-langs
```

## Scene art

Scene stills are **language-neutral** (no baked-in text — captions are an
overlay), so one image per scene is reused across all nine languages. The
image-generation handoff is a per-book manifest:

```
data-library/{slug}/audioplay/scenes/scenes.yaml   # style bible + per-scene prompts
data-library/{slug}/audioplay/scenes/<scene>.jpg   # source-of-truth stills
  → assets.wheelofheaven.world/images/cinematic/{slug}/<scene>.jpg
```

`scenes.yaml` carries a per-book **style bible** (a shared prompt prefix/suffix
so the slideshow reads as one film) and one entry per `scene` id used in the
cue sheets. Images are generated externally (OpenAI image generation) and
synced to the CDN. Both renderers degrade gracefully when a still is missing:
a named scene falls back to the book-wide `default.jpg`, then to a gradient —
so the timeline can go live before the art is finished.

## The render spec — `style/<id>.json`

A single token set both renderers read (the web view mirrors the values in
SCSS). Covers output (1920×1080, H.264, CRF, fps), scene crossfade +
Ken-Burns, caption typography + safe-area, the brand watermark, and the
scrim/vignette.

## Phase 2 — the web cinematic view

A `createCinematicView()` controller inside
`themes/bifrost/static/js/listen-button.js` (same module as the player), styled
by `sass/components/_cinematic.scss`. It is a pure consumer of the prerecorded
engine's existing callbacks:

- `onChapterChange(n)` → fetch that chapter's `cinematic.json`
- `onProgress(ratio, seconds, total)` → drive the scene slideshow, the current
  caption, and the seek bar off the same clock
- `onStart/onPause/onResume/onEnd` → reflect play state

Behaviour: two `.cinematic__bg` layers cross-fade with CSS Ken-Burns; a
caption layer shows the current sentence (speaker label on a **speaker
change**, never the intro); a persistent top-left brand watermark; an
auto-hiding play bar (revealed on pointer move / touch); **Space** toggles,
**Esc** exits. The toggle appears in the player bar only when a prerecorded
audio play exists (`body.woh-audio-available`).

## Phase 3 — the ffmpeg compositor

`compose_video.py` renders the same timeline to an MP4:

```sh
cd data-cinematics/audiobook
mise run setup            # one-time: Pillow venv
mise run compose-preview  # 30s smoke test of chapter 1
mise run compose          # all EN chapters → ./out/
python3 compose_video.py --book <slug> --lang en --chapters 1 --preview 25
```

Per chapter:

1. Each scene becomes a Ken-Burns `zoompan` clip.
2. An `xfade` chain keeps the video **sync-locked** to the audio — clip
   duration is `segment + crossfade` and the transition offset is the scene's
   absolute `start`, then the whole thing is trimmed to the audio length. So
   scene cuts land on `scene.start` and captions never drift.
3. `vignette`, then the caption overlay, then the watermark overlay.
4. Audio is voice + ambient (`amix`), encoded H.264 per the render spec with
   `+faststart`.

Captions and the watermark are **pre-rendered with Pillow**, not ffmpeg text
filters — so no `libass`/`drawtext` is required (the project's ffmpeg is a
minimal build). Captions become a transparent qtrle track; the watermark
rasterizes the real bifrost **logomark + wordmark** SVGs via `resvg` (so the
brand typeface is exact), recolored opaque with a soft drop shadow.

> The output MP4 is finalized (moov atom + faststart) only at the very end of
> the encode. A file that's mid-render is unplayable — wait for the run to
> finish before opening it.

## Voicing names correctly

The audio is synthesized on ElevenLabs' **multilingual** model, which does
**not** honor `<phoneme>` SSML — so phoneme-tagged names (Raël, Yahweh, Elohim)
were emitted with zero duration and never spoken. The pipeline instead applies
the lexicon's per-language **fallback respellings** (`Rah-EL`, `YAH-way`,
`el-oh-HEEM`) so the voice says them, and then **relabels the timing back to
the original spelling** so captions still read "Yahweh", not "YAH-way". See the
[Audio Play Pipeline](@/contributing/dev/audio-play-pipeline.md) for the
lexicon and `generate_audio.py` details. Keep `use_ssml_phoneme: false` in
`voices.yaml` while on a multilingual model.

## Operating it

| Need | Command (from `data-cinematics/audiobook/`) |
|------|---------------------------------------------|
| Build timelines (EN) | `mise run timeline` |
| Build timelines (all langs) | `mise run timeline-all` |
| Set up the compositor venv | `mise run setup` |
| 30s preview render | `mise run compose-preview` |
| Render all EN chapters | `mise run compose` |
| Render all languages | `mise run compose-all-langs` |

**Dependencies:** `ffmpeg` (with `libx264, aac, zoompan, xfade, vignette,
qtrle`), a Pillow venv, and `resvg` (`brew install resvg`) for the watermark.
Caption font is Space Grotesk (matches the web `--font-family-lead`).

## Deployment & caveats

`cinematic.json` files deploy with the audio to the assets CDN (Cloudflare
Pages) and inherit the `/audio/*.json` revalidating cache rule. Two things to
know — see the [assets CDN](@/architecture/sites/assets.md) docs:

- **Cloudflare Pages serves files up to 25 MiB.** Chapter `.mp3` files can
  exceed that and **404** on the CDN — harmless, because the player uses
  `.opus` (~7 MB), which is well under the limit. The large `.mp3` are only
  needed locally (to transcode to opus); committing them to the CDN repo bloats
  every deploy and is best avoided.
- **Large pushes deploy slowly.** A multi-hundred-MB audio change on the large
  assets repo can take a long time (or stall) on Pages. Prefer deploying opus +
  JSON and keeping heavy intermediates out of the repo.

Rendered MP4s (`out/`) are build artifacts — gitignored, uploaded to YouTube
manually.

## File map

```
data-cinematics/audiobook/
  build_timeline.py     # Phase 0 — derive cinematic.json
  compose_video.py      # Phase 3 — render MP4s
  style/<id>.json       # shared render spec
  brand/                # logomark.svg + wordmark.svg (mirror bifrost)
  out/                  # rendered MP4s (gitignored)
data-library/{slug}/audioplay/
  cues/c{N}.yaml        # scene shot list
  scenes/scenes.yaml    # image-gen manifest + style bible
  scenes/<scene>.jpg    # source stills
assets.wheelofheaven.world/
  audio/{lang}/{slug}/c{N}.cinematic.json
  images/cinematic/{slug}/<scene>.jpg
themes/bifrost/
  static/js/listen-button.js        # web cinematic view controller
  sass/components/_cinematic.scss
```
