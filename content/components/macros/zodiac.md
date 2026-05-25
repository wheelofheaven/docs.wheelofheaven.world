+++
title = "zodiac"
description = "Hand-drawn SVG zodiac-sign glyphs — one macro covering all twelve signs, stroke-based, inherits `currentColor`."
template = "page.html"
weight = 100
+++

`macros/zodiac.html` renders the twelve zodiac-sign glyphs used by the
Timeline section (each precessional age is named for a zodiac sign).
Hand-drawn SVGs sized to a `24×24` viewBox, stroke-based, inherits
colour via `currentColor`.

**Source:**
[`themes/bifrost/templates/macros/zodiac.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/macros/zodiac.html)

## Public API

```tera
{%/* import "macros/zodiac.html" as zodiac */%}

{{ zodiac::icon(name="aquarius") }}
{{ zodiac::icon(name="pisces", size=32) }}
```

| Param  | Type    | Required | Default | What                                                |
|--------|---------|----------|---------|-----------------------------------------------------|
| `name` | string  | yes      | —       | One of `aries`, `taurus`, `gemini`, `cancer`, `leo`, `virgo`, `libra`, `scorpio`, `sagittarius`, `capricorn`, `aquarius`, `pisces`. |
| `size` | number  | no       | `24`    | Pixel size — sets both `width` and `height`.        |

## Live examples

Each Timeline age renders its sign's glyph via this macro. E.g.
[/timeline/age-of-aquarius/](https://www.wheelofheaven.world/timeline/age-of-aquarius/).
