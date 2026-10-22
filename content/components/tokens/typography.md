+++
title = "Font coverage and scholarly transliteration"
description = "Jost coverage, the Firmament Sans scholarly extension, and the separation between Latin transliteration and source scripts."
template = "page.html"
weight = 25
+++

The primary Latin reading font is Jost.
Its self-hosted files include the full upstream Latin Extended and Cyrillic coverage in regular, italic, bold, and bold italic.
The files live at `static/fonts/vendor/jost/jost-full-*.woff2` in the website repository.
The regular face is preloaded by Bifrost; other styles load when used.

## Existing coverage

Full Jost covers letters such as `ā ē ī ō ū š`, which were missing from the website's older Latin/Cyrillic subset.
The font files contain 524 mapped codepoints; the previous regular file contained 297.
CSS uses the self-hosted files directly without a `local()` override, so installed Jost versions cannot silently change coverage.
The vendor directory includes the font's Open Font License and pinned build provenance.

## Scholarly extension

[Firmament Sans](https://github.com/wheelofheaven/firmament-sans) is the separately named, experimental Jost derivative for scholarly Latin transliteration.
Its first static builds add under-dotted, underlined, and under-breve letters, half-ring letters, and schwa.
It remains separate from the website's body-font selection while its specimens undergo visual review.

The fork contains a corpus inventory with Unicode names, occurrence counts, example paths, and coverage comparisons.
Counts describe published Markdown source and library JSON strings across all locales; they are not measurements of browser fallback.
Library quotations and original scripts often use other font stacks.
Draft Markdown and library review/curation/audio directories are excluded.

Run `mise run audit` in the font repository to refresh the inventory against a sibling website checkout.
Run `mise run build` and `mise run check` to build and validate all four static styles.
The shaping checks compare precomposed and decomposed forms and verify that ordinary upstream Latin and Cyrillic text retains its shaping.

## Source scripts and typography roles

This extension addresses Latin transliteration within prose.
Hebrew, Greek, cuneiform, and East Asian writing keep their script-specific fonts and the existing body/display/citation/metadata roles.
An unsupported character in a heading or quotation needs investigation of that element's font stack; changing Jost alone does not change Space Grotesk or IBM Plex Serif.
