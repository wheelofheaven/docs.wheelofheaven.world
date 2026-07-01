+++
title = "Video Channels & Publishing"
description = "How rendered cinematic-audiobook videos get published: the video-channels catalog repo, per-language platform accounts, channel branding (avatars + banners), and the metadata/description conventions."
template = "page.html"
weight = 48
+++

The [Cinematic Audiobook](@/contributing/dev/cinematic-audiobook.md) pipeline
renders upload-ready MP4s + thumbnails. **Publishing** them — to a YouTube
channel per language (plus locale-appropriate alternatives), with curated
metadata and consistent branding — is managed in a dedicated repo:
**`video-channels`**.

It is the source of truth for *what video exists, where it lives, what it says,
and where it's published.* It stores **metadata only — never the MP4 masters**
(those stay as reproducible build artifacts in `data-cinematics`).

## The repo

```
video-channels/
  platforms/accounts.yaml          # a channel per language + locale alternatives
  catalog/<book>/
    _book.yaml                     # shared book metadata (links, playlists, credits)
    c<n>.<lang>.yaml               # one record per (book, chapter, language) video
  templates/youtube-description.md # description shape + guidance
  schema/video-record.md           # field reference
  scripts/report.py                # "what we have / where / status" across the catalog
  brand/
    generate_avatars.py            # 9 channel avatars (profile pictures)
    generate_banners.py            # 9 channel banners (channel art)
    avatars/<lang>.png             # 1024×1024
    banners/<lang>.png             # 2560×1440
```

## Channel strategy

One dedicated channel **per site language**, so each locale gets a coherent
feed in its own language. YouTube is primary for most; where it's blocked or
not dominant, lead with locale platforms:

| Lang | Primary | Alternatives |
|---|---|---|
| en / de / es / zh-Hant | YouTube | — |
| fr | YouTube | Dailymotion |
| ja | YouTube | Niconico |
| ko | YouTube | Naver TV |
| ru | YouTube | VK Video, RuTube, Dzen (YouTube throttled in RU) |
| zh | **Bilibili** | Youku, Tencent Video (YouTube blocked in mainland CN) |

### Naming convention

English takes the bare brand; every other channel is `@WheelOfHeaven{CODE}` so
the family is instantly recognizable.

| Lang | Channel name | Handle |
|---|---|---|
| en | Wheel of Heaven | `@wheelofheaven` |
| de | Wheel of Heaven (Deutsch) | `@WheelOfHeavenDE` |
| es | Wheel of Heaven (Español) | `@WheelOfHeavenES` |
| fr | Wheel of Heaven (Français) | `@WheelOfHeavenFR` |
| ja | Wheel of Heaven (日本語) | `@WheelOfHeavenJA` |
| ko | Wheel of Heaven (한국어) | `@WheelOfHeavenKO` |
| ru | Wheel of Heaven (Русский) | `@WheelOfHeavenRU` |
| zh | Wheel of Heaven (中文) | `@WheelOfHeavenZH` |
| zh-Hant | Wheel of Heaven (繁體中文) | `@WheelOfHeavenTW` |

Record the real handle + channel URL in `accounts.yaml` once a channel exists
(status `planned` → `created` → `active`).

## Channel branding

Both generators render from the bifrost **logomark + wordmark** SVGs (recolored
white via `resvg`) on the dark brand background, so the kit stays in lockstep
with the site. Re-run either script if the logo or palette changes.

**Avatars** (`brand/generate_avatars.py` → `brand/avatars/<lang>.png`, 1024×1024)
— the logomark on the brand background with a soft glow. English is the
unadorned flagship; every other channel carries a small lavender language code
(DE/ES/FR/JA/KO/RU/ZH/TW). All content sits inside YouTube's circular crop.

**Banners** (`brand/generate_banners.py` → `brand/banners/<lang>.png`, 2560×1440)
— logomark + `WHEEL OF HEAVEN` wordmark + a localized *Cinematic Audiobooks*
tagline + `www.wheelofheaven.world`, all inside the **1546×423 safe zone** that
shows on every device; the wide areas fade to a clean vignette for the TV /
desktop crops. Latin taglines use Space Grotesk; RU/CJK use Arial Unicode.

## The catalog

One record per (book, chapter, language) — see `schema/video-record.md` for the
full field list. It captures the render **source** (repo + path in
`data-cinematics`, duration, resolution, fps — not the bytes), the curated
**publish metadata** (title, description, tags, hashtags), and per-platform
**targets** (account, status, URL).

Status vocabulary: `planned` → `rendered` → `ready` (metadata curated) →
`scheduled` → `published`.

`scripts/report.py` prints a table across the catalog — status per target and
whether the local MP4 exists — so gaps are obvious at a glance.

### Description conventions

Curated per language (translate the boilerplate; don't machine-translate the
lede). See `templates/youtube-description.md`. Two rules that matter for
YouTube:

- **One line per paragraph.** YouTube preserves newlines literally, so never
  hard-wrap mid-paragraph in the YAML — one long line per paragraph, blank line
  between; YouTube soft-wraps it.
- **Hashtags** end the description (also mirrored in a `hashtags:` field). The
  first three surface above the title. Keep them ASCII (`#Rael`, not `#Raël`).

Title format: `{book title} — Ch. {n}: {chapter_title} | Wheel of Heaven`.

## Publish workflow

1. `data-cinematics` renders `c{N}.{lang}.mp4` + `c{N}.{lang}.thumb.jpg`.
2. Add/refresh the catalog record here (`python scripts/report.py` shows gaps).
3. Curate the title/description/tags (per `templates/`).
4. Upload to the language's channel with its avatar + banner; record the URL and
   flip the target's status to `published`.

MP4s are uploaded manually today; a YouTube Data API uploader driven by the
catalog is a natural future step.
