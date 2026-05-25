+++
title = "Wiki shortcode visuals"
description = "Three SCSS files that style content rendered by the markdown shortcodes — wiki-quotes (blockquotes + `library`), wiki-cite (`cite`), wiki-shortcodes (info / definition boxes)."
template = "page.html"
weight = 30
+++

Three Bifrost SCSS files style the visual surface of the
[content shortcodes](../../shortcodes/). They're documented together
because they form a single rendering layer — every shortcode invoked
inside markdown ends up styled by one of these files.

## `.wiki-content blockquote` + `.library-quote`

Source:
[`themes/bifrost/sass/components/_wiki-quotes.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_wiki-quotes.scss)

Styles two things:

| Selector                             | What                                              |
|--------------------------------------|---------------------------------------------------|
| `.wiki-content blockquote`           | Enhanced markdown blockquotes inside articles — gradient border, rounded corners, decorative quote glyph. |
| `.library-quote`                     | The structured library-quote block rendered by the [`library` shortcode](../../shortcodes/library/). |
| `.library-quote__button`             | The "Read in *Book*" CTA — uses [`glass-cloud-button`](../../visual-language/glass-cloud-button/) with a mauve→cyan duo. |

## `.wiki-cite`

Source:
[`themes/bifrost/sass/components/_wiki-cite.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_wiki-cite.scss)

Styles the inline citation markers rendered by the
[`cite` shortcode](../../shortcodes/cite/). Superscript pill in
`font-family-tech`, accent-coloured background on hover.

| Class                | What                                              |
|----------------------|---------------------------------------------------|
| `.wiki-cite`         | Wrapper, `vertical-align: super`, `font-size: 0.75em`. |
| `.wiki-cite__link`   | The marker itself — pill with hairline border.    |

## `.wiki-info-box` + `.wiki-definition-box`

Source:
[`themes/bifrost/sass/components/_wiki-shortcodes.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_wiki-shortcodes.scss)

Styles the boxes rendered by `info` and `definition`.

| Class                          | Rendered by                          |
|--------------------------------|--------------------------------------|
| `.wiki-info-box`               | [`info`](../../shortcodes/info/)         |
| `.wiki-definition-box`         | [`definition`](../../shortcodes/definition/) |

Both: bordered + rounded, with a 4px accent stripe down the left edge
and a header row (icon + title) above the body content.

## Live examples

- Any wiki entry mixes all of these, e.g.
  [/wiki/elohim/](https://www.wheelofheaven.world/wiki/elohim/) (blockquote,
  citations, info boxes, library-quote block).

## Related

- [Content shortcodes](../../shortcodes/) — the markdown-facing API these styles render.
- [`glass-cloud-button`](../../visual-language/glass-cloud-button/) — used by `.library-quote__button`.
