+++
title = "Font coverage and scholarly transliteration"
description = "Firmament Sans body typography, scholarly Latin coverage, versioned web fonts, and the separation between transliteration and source scripts."
template = "page.html"
weight = 25
+++

The primary Latin and Cyrillic reading font is [Firmament Sans](https://firmament.wheelofheaven.world/),
Wheel of Heaven's scholarly extension of Jost.
Bifrost selects all four static styles: regular, italic, bold, and bold italic.
The website supplies the self-hosted files at
`static/fonts/vendor/firmament-sans/0.1/FirmamentSans-*.woff2`.
The regular face is preloaded; other styles load when used.

## Coverage and deployment

Each 0.1 style contains 584 Unicode mappings, including 60 additions to full upstream Jost.
Alongside macrons and carons (`ā ē ī ō ū š`), Firmament adds scholarly forms such as
`ḥ ṣ ṭ ḫ ṛ ḇ ṯ`, half-ring letters `ʾ ʿ`, schwa `ə Ə`, and four combining marks below.
It preserves Jost's existing Latin and Cyrillic outlines and layout.

CSS uses the deployed files directly without a `local()` override, so installed fonts cannot silently change coverage.
The vendor directory includes the Open Font License, pinned build provenance, and SHA-256 checksums.
Versioned paths respect the CDN's immutable font cache: future releases need a new directory,
matching Bifrost declarations/preload, and an updated service-worker precache.
The website's service worker uses cache version `v22` for this migration.
Older Jost files remain available for cached stylesheets.

## Review and maintenance

[Firmament Sans 0.1](https://github.com/wheelofheaven/firmament-sans) remains an optical-review pilot.
Deployment does not imply complete scholarly or language coverage.
Remaining work includes broader IPA and Latin coverage, optical spacing and stacked accents,
general mark-to-mark attachment, and variable-font masters.
The [specimen](https://firmament.wheelofheaven.world/) provides four-style proofs and an interactive character inventory.

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
An unsupported character in a heading or quotation needs investigation of that element's font stack; changing the body family alone does not change Space Grotesk or IBM Plex Serif.

See the [script-expansion study](https://github.com/wheelofheaven/firmament.wheelofheaven.world/blob/main/docs/script-expansion.md) for proposed Greek, Hebrew, Arabic, cuneiform, and CJK development. These are not new glyph repertoires in the deployed 0.1 fonts.
