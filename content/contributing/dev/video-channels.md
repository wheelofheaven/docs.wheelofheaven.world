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
  platforms/about.yaml             # paste-ready channel "About" text per language
  platforms/keywords.yaml          # channel keyword sets per language
  catalog/<book>/
    _book.yaml                     # shared book metadata (links, playlists, credits)
    c<n>.<lang>.yaml               # one record per (book, chapter, language) video
  templates/youtube-description.md # description shape + guidance
  schema/video-record.md           # field reference
  scripts/report.py                # "what we have / where / status" across the catalog
  brand/
    background.avif                # canonical Milky Way background (site-wide)
    brandkit.py                    # shared background compositor + SVG rasterizer
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

### Channel registry

English takes the bare brand; every other channel is `@WheelOfHeaven{CODE}` so
the family is instantly recognizable. **`platforms/accounts.yaml` is the source
of truth** — this table mirrors it. Flip `status` (`planned` → `created` →
`active`) and fill `channel_id` as each channel comes online.

| Lang | Channel name | Handle | URL | Status |
|---|---|---|---|---|
| en | Wheel of Heaven | `@WheelofHeaven` | https://www.youtube.com/@WheelofHeaven | created |
| de | Wheel of Heaven (Deutsch) | `@WheelOfHeavenDE` | https://www.youtube.com/@WheelOfHeavenDE | created |
| fr | Wheel of Heaven (Français) | `@WheelOfHeavenFR` | https://www.youtube.com/@WheelOfHeavenFR | created |
| es | Wheel of Heaven (Español) | `@WheelOfHeavenES` | https://www.youtube.com/@WheelOfHeavenES | created |
| ja | Wheel of Heaven (日本語) | `@WheelOfHeavenJA` | https://www.youtube.com/@WheelOfHeavenJA | created |
| ko | Wheel of Heaven (한국어) | `@WheelOfHeavenKO` | https://www.youtube.com/@WheelOfHeavenKO | created |
| ru | Wheel of Heaven (Русский) | `@WheelOfHeavenRU` | https://www.youtube.com/@WheelOfHeavenRU | created |
| zh | Wheel of Heaven (中文) | `@WheelOfHeavenZH` | https://www.youtube.com/@WheelOfHeavenZH | created |
| zh-Hant | Wheel of Heaven (繁體中文) | `@WheelOfHeavenTW` | https://www.youtube.com/@WheelOfHeavenTW | created |

Each channel's **About** text is in `platforms/about.yaml` (paste-ready per
language, one line per paragraph; `Elohim`/`Yahweh` kept in the original
spelling), and channel **keywords** in `platforms/keywords.yaml` (one localized
set per language, under YouTube's 500-character cap).

### Site footer link (per i18n page)

The YouTube link in the reading-site footer is **per language**: each localized
page links to that language's channel. It's driven by a `youtubeChannelUrl`
translation key in `www.wheelofheaven.world/config.toml` (one per language
block), consumed by `themes/bifrost/templates/partials/footer.html` (and the
social-icon partial + contact page) via `trans(key="youtubeChannelUrl",
lang=detected_lang)`.

A language whose channel isn't `created` yet — and Hebrew (`he`), which has no
channel (no Hebrew audio) — points at the **EN flagship** so no footer link
404s. When a channel goes live, set its `youtubeChannelUrl` to the real URL.

## Channel branding

Both generators share `brand/brandkit.py`, which composites over the **canonical
Milky Way background** used site-wide (the same `wheel-of-heaven-background`
image behind the OG cards / essentials, vendored as `brand/background.avif`) and
rasterizes the bifrost **logomark + wordmark** SVGs (white via `resvg`) — so the
kit stays in lockstep with the site. Each language gets a different horizontal
**pan** across the galaxy, so the per-channel files stay distinct. Re-run either
script if the logo, background, or palette changes.

**Avatars** (`brand/generate_avatars.py` → `brand/avatars/<lang>.png`, 1024×1024)
— the logomark enlarged to **fill the frame** over the background. English is the
unadorned flagship; every other channel carries a small lavender language code
(DE/ES/FR/JA/KO/RU/ZH/TW). All content sits inside YouTube's circular crop.

**Banners** (`brand/generate_banners.py` → `brand/banners/<lang>.png`, 2560×1440)
— logomark + `WHEEL OF HEAVEN` wordmark + `www.wheelofheaven.world`, all inside
the **1546×423 safe zone** that shows on every device, with a soft edge vignette
for the TV / desktop crops. Deliberately **content-agnostic** (no format
tagline) so the channels can carry other content later.

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
