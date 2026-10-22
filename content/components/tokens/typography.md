+++
title = "Firmament Sans and scholarly typography"
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

## Project and design direction

Firmament began with a reading problem: scholarly Latin characters in the main site's
Jost subset fell back to visibly different typefaces inside otherwise continuous words.
The project preserves Jost's geometric character while adding the distinctions that
etymology and transliteration need. Jost is credited to Owen Earl / indestructible type;
Firmament is an independently named derivative under the SIL Open Font License.

The public story connects the clarity of 1920s German design with the transmission of
knowledge into a future society. Bauhaus, New Typography, and New Objectivity provide
three distinct points of reference: practical design, the organisation of information,
and attention to the subject. These are Firmament's contemporary influences, not a claim
that the Bauhaus designed Jost or that the movements were interchangeable.
Jost's immediate reference is the spirit of Futura.

The guiding principle is **form follows function**: make inherited knowledge readable,
preserve meaningful distinctions, and leave tools that the next generation can inspect
and improve. The maxim predates the Bauhaus; the
[public design story](https://firmament.wheelofheaven.world/#story) links the historical
sources and separates their history from our interpretation.
The Wheel of Heaven wink is: *our feet on the baseline and our eyes on the stars*.

## Repositories and responsibilities

| Project | Responsibility |
| --- | --- |
| [firmament-sans](https://github.com/wheelofheaven/firmament-sans) | Jost history, pinned inputs, font construction, TTF/WOFF2 artifacts, corpus audit, shaping checks, OFL |
| [firmament.wheelofheaven.world](https://github.com/wheelofheaven/firmament.wheelofheaven.world) | Zola specimen, design story, character explorer, download ZIP, social/brand artwork, script study |
| [bifrost](https://github.com/wheelofheaven/bifrost) | Main-site font declarations, body stack, preload, typography-role documentation |
| [www.wheelofheaven.world](https://github.com/wheelofheaven/www.wheelofheaven.world) | Versioned web-font copies, provenance, checksums, offline precache, theme pin |
| [docs.wheelofheaven.world](https://github.com/wheelofheaven/docs.wheelofheaven.world) | This integration and maintenance guide |

The font and showcase repositories both link to `https://firmament.wheelofheaven.world/`
as their public homepage. Their descriptions, topics, and READMEs describe the scholarly
extension and modernist design story. Changing the specimen alone does not update the
main site's pinned fonts or Bifrost dependency.

## Showcase and hosting

The [one-page specimen](https://firmament.wheelofheaven.world/) includes an editable
typesetter, four-style family proofs, letterform anatomy, Jost comparison, searchable
character inventory, display and paragraph specimens, multilingual proofs, numbers and
signs, design story, release limitations, and licensed downloads.
It is Zola 0.22.1 with self-hosted fonts and small dependency-free JavaScript.

Cloudflare Pages builds the showcase repository's `main` branch with `zola build`,
publishes `public`, and uses `ZOLA_VERSION=0.22.1`. The custom domain is
`firmament.wheelofheaven.world`. Hosting was configured through the Cloudflare dashboard;
there is no separate Worker application. Run `mise run build` and `mise run check`
in the showcase repository before publishing changes.

## Brand assets and README screenshots

Both repositories carry the same self-contained assets under `docs/images/`:

- `brandmark.svg`: Firmament Italic's lowercase **f** with a rust-coloured dot.
- `brandtype.svg`: **Firmament.** drawn from the actual Regular outlines, with a rust full stop.
- `showcase.jpg`, `typesetter.jpg`, and `characters.jpg`: live Chrome viewport captures,
  with capture date and context recorded in `docs/images/README.md`.

The palette is warm paper `#f1f0e9`, forest `#26372f`, and rust `#a74732`.
SVG outlines make the README identity independent of fonts installed on the viewer's device.
The canonical renderer is `scripts/render-brand.py` in the showcase repository;
it uses FontTools and HarfBuzz. Run it when the identity or font release changes, then
copy the reviewed assets to the font repository. Keep both READMEs' image links and
capture notes aligned. Refresh screenshots from the working site when its design changes.

Site code and original prose are CC0-1.0. Bundled fonts and derivative outlines retain
the OFL; the site's CC0 license does not replace it. Preserve authorship, licenses,
and provenance when copying assets.

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


## Multiscript direction

A coordinated family should respect each script's own reading conventions.
The following is a development proposal, not coverage claimed by Firmament 0.1:

| Script | Proposed route | Main review requirements |
| --- | --- | --- |
| Greek | First original extension, including polytonic text | Native-reader review, accent combinations, spacing and reading rhythm |
| Hebrew | Dedicated companion, with pointed text as the priority | Vowel points, cantillation, final forms, mixed-direction passages |
| Arabic | Specialist-led companion with a defined language and notation scope | Contextual joining, cursive attachment, marks; no Latin-style tracking |
| Cuneiform | Reviewed scholarly companion first | Sign distinctions and tradition; Sumero-Akkadian, Ugaritic, and Old Persian are separate scopes |
| CJK | Regional companions first; evaluate Source Han Sans / Noto Sans CJK | Regional Han forms, kana, Hangul, punctuation, language tags, download size |

The [full feasibility study](https://github.com/wheelofheaven/firmament.wheelofheaven.world/blob/main/docs/script-expansion.md)
contains corpus evidence, candidate families, relative effort, and release gates.
Its counts inventory source strings, not actual browser fallback or a complete target repertoire.
Build a companion proof page first, pin exact releases and licenses, test full grapheme
clusters and HarfBuzz shaping, and require native-reader or scholarly review at reading sizes.
Add script fonts on demand. Do not silently merge or rename another family's outlines.

## Publishing the next font release

1. In `firmament-sans`, follow the pinned tooling in `mise.toml`: `mise run setup`,
   `mise run build`, and `mise run check`. Refresh the corpus audit when relevant.
   Review regular, italic, bold, and bold italic at actual reading sizes.
2. In the showcase, run `scripts/sync-fonts.py` against the sibling font checkout.
   Review the generated character inventory, statistics, licenses, ZIP README, and
   versioned download names; regenerate social and brand artwork if affected.
3. Copy the reviewed WOFF2 files into a new version directory in the main website,
   with the exact source commit, OFL, and updated checksums. Avoid replacing bytes
   behind an existing immutable URL.
4. Update Bifrost's `sass/base/_fonts.scss`, `sass/base/_typography.scss` when the
   family changes, and `templates/partials/fonts-css.html`. Update the site's
   `static/sw.js` precache and increment its cache version.
5. Build the consuming website and inspect desktop/mobile prose, emphasis, scholarly
   marks, Cyrillic, and source-script companions. Check both `main.css` and
   `critical.css`; previews must load local CSS rather than the production URLs.
6. Merge the theme first, then advance the website's theme pin alongside its font
   assets. Publish the updated documentation and showcase as needed.
7. Verify the production deployment, actual font URLs, checksums, computed body stack,
   and preload. A merged PR alone does not prove the new font is live.

The initial main-site adoption is recorded in
[website PR #28](https://github.com/wheelofheaven/www.wheelofheaven.world/pull/28),
[Bifrost PR #3](https://github.com/wheelofheaven/bifrost/pull/3), and
[documentation PR #3](https://github.com/wheelofheaven/docs.wheelofheaven.world/pull/3).
All four deployed 0.1 files passed coverage, canonical-shaping, and upstream-regression
checks; the main site built 10,999 pages and was checked in desktop and 390px mobile previews.
