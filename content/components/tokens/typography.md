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
Bifrost also adds `fonts=firmament-0.1` to its stylesheet URLs: a pre-deployment
preview had requested the new CSS hash while production still served the old sheet,
so the CDN cached Jost under that URL. The explicit release key bypasses that entry.
Keep preview base URLs local and advance this key when publishing a new font release.
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
Greek, cuneiform, and East Asian writing keep their script-specific fonts and the existing body/display/citation/metadata roles.
An unsupported character in a heading or quotation needs investigation of that element's font stack; changing the body family alone does not change Space Grotesk or IBM Plex Serif.

See the [script-expansion study](https://github.com/wheelofheaven/firmament.wheelofheaven.world/blob/main/docs/script-expansion.md) for proposed Greek, Hebrew, Arabic, cuneiform, and CJK development. These are not new glyph repertoires in the deployed 0.1 fonts.

### Hebrew: locale companion versus citation serif

Hebrew is served by two faces with two jobs, selected by the cascade in `sass/base/_base.scss`:

| Surface | Selector | Font | Why |
| --- | --- | --- | --- |
| Hebrew locale running prose, headings, navigation, interface text | `:lang(he)` sets `--font-family-body` and `--font-family-lead` | **Miriam Libre** (`$font-family-he-body`, `$font-family-he-display`), one variable WOFF2 (wght 400–700) subset to the Hebrew blocks | The Hebrew analog of the Firmament Sans / Space Grotesk pair. Measured in the [companion proof](https://firmament.wheelofheaven.world/companions/): stem 78 ‰ against Firmament's 80 ‰ at Regular, letter height 579 inside the x-height–cap band, colour within a few per cent. Its Hebrew revives Raphael Frank's monolinear Miriam, as Frank Ruhl Libre revives Frank's Frank-Rühl. |
| Inline Hebrew citations in other-language prose, interlinear tokens, the language-switcher item, scripture and library originals | `:not(:root)[lang="he"]`, `.hebrew`, and every element on `--font-family-citation` | **Frank Ruhl Libre** (`$font-family-hebrew`) | The scholarly citation register. It also carries sof pasuq and cantillation, which Miriam Libre lacks; pointed source text therefore never leaves this layer. |

### Arabic: interface face and reading face

Arabic had no web font on the main site until 25 October 2026; readers saw whatever their
operating system supplied. Two companions from the proof now cover it, split by job the way
Hebrew is:

| Surface | Selector | Font | Why |
| --- | --- | --- | --- |
| Inline terms in prose (`.arabic`), navigation, any Arabic glyph reached through the body or display stack | `.arabic`; **Cairo** listed after Noto Sans IPA in `$font-family-sans` and `$font-family-serif`. Elements tagged `lang="ar"` get direction and bidi isolation only and keep their layer's font | **Cairo**, variable wght 200–1000, slant pinned upright, Arabic-only subset (297 mappings) | Kufi-based, drawn as the companion to a geometric Latin; stem 0.96× the contract, alef on the cap height. |
| Library originals and scripture blocks (the Hidden Words) | every element on `--font-family-citation`; **Noto Naskh Arabic** listed after Noto Sans IPA in `$font-family-citation` | **Noto Naskh Arabic**, variable wght 400–700, Arabic-only subset (1,177 mappings, full vocalisation) | Naskh carries long text more kindly than Kufi; 0.79× stem is deliberate for a reading face. |

Both `@font-face` rules are bounded by `unicode-range` to the Arabic blocks, so the files load
only on pages with Arabic and Latin never touches them. Inline Arabic is right-to-left and
bidi-isolated like inline Hebrew. Provenance, subset ranges and checksums live in
`static/fonts/vendor/cairo/` and `static/fonts/vendor/noto-naskh-arabic/` in Bifrost.
Native-reader review of a full Hidden Words chapter at reading size is still owed.

### Japanese body face

On 25 October 2026 the Japanese body face changed from Zen Kaku Gothic New to **Noto Sans JP**
(`$font-family-ja-body`; the Google Fonts link in `partials/fonts-css.html`). In the companion
proof Zen Kaku measured 0.84× the contract stem, visibly lighter than Firmament beside it,
while Noto Sans JP measured 1.01× and matches the Noto Sans SC/TC/KR siblings in weight and
rhythm. M PLUS 1p stays the Japanese display face.

Before this split (24 October 2026) `:lang(he)` set the citation serif directly on every element of the Hebrew locale.
That out-specified the plain-element heading rules and lost to component class selectors, so the locale had no body/display layering and component headings fell to system Hebrew fonts.
The `@font-face` for Miriam Libre is bounded by `unicode-range` to U+0590–05FF, U+FB1D–FB4F, U+200C–2010, U+20AA and U+25CC, so Latin words, digits and punctuation inside Hebrew pages still come from Firmament Sans and Space Grotesk, and the file is never fetched on pages without Hebrew.
It is preloaded only when `detected_lang == "he"` (`partials/fonts-css.html`).
Provenance, subset ranges and the checksum live in `static/fonts/vendor/miriam-libre/` in Bifrost.
Miriam Libre's heaviest instance (700) measures 120 ‰, lighter than Firmament Bold's 152 ‰; Hebrew headings therefore read slightly lighter than their Latin counterparts, which was judged acceptable for a companion and is recorded in the proof.


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
Add script fonts on demand. Do not silently merge or rename another family's outlines.

### The companion proof and the metric contract

The study's first step, a companion proof page, is published at
<https://firmament.wheelofheaven.world/companions/> and generated by
`scripts/companions.py` in the showcase repository from a pinned `google/fonts` commit.
It defines the **metric contract** that "harmonious with Firmament" means in numbers,
read from the 0.1 outlines:

| Measure | Regular | Bold |
| --- | ---: | ---: |
| x-height / cap height | 460 / 700 | 460 / 700 |
| Ascender / descender | 1070 / −375 | 1070 / −375 |
| Stem (Latin l) | 80 ‰ | 152 ‰ |
| Typographic colour (ink per em²) | 184.6 ‰ | 283.9 ‰ |

A companion fits when its stem and colour are within a tenth of the contract at the same
nominal weight, its working letter height sits between x-height and cap height, and its
marks and joins survive HarfBuzz shaping. Futura's geometry does not travel between
scripts; the measurements do. Outcomes so far: Miriam Libre adopted for the Hebrew
locale (above); Cairo and Noto Naskh Arabic adopted for Arabic (above); the Japanese body
face moved to Noto Sans JP; no open Greek fits, which is the argument for drawing
Firmament Greek (brief in `firmament-sans/scholar/greek/`); cuneiform and the other CJK
pairings keep their current faces, now recorded with measurements as pairing specifications.

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

### Where Firmament is adopted

| Surface | Body face | Since |
| --- | --- | --- |
| [Showcase](https://firmament.wheelofheaven.world/) | Firmament Sans 0.1 | 2026-10-22 |
| [Main website](https://www.wheelofheaven.world/) (Bifrost) | Firmament Sans 0.1, `static/fonts/vendor/firmament-sans/0.1/` | 2026-10-22 |
| This documentation site (`docs-theme`) | Firmament Sans 0.1, `themes/docs-theme/static/fonts/vendor/firmament-sans/0.1/`; Mermaid diagrams use the same family; version 0.1 has no 500 weight, so medium resolves to Regular | 2026-10-25 |
| Open Graph images (`data-images/og`) | Firmament Sans 0.1 from the website's vendor tree; a template font change needs `--force` because the hash covers content fields only | 2026-10-25 |

Deliberately unchanged: the narrative map poster (its Latin labels share Jost's outlines, and
the served SVG is text-to-path), the EPUB stylesheet (generic families by design, so e-readers
keep their own font preferences), and the video and brand renderers, which use Space Grotesk,
the display face.

The initial main-site adoption is recorded in
[website PR #28](https://github.com/wheelofheaven/www.wheelofheaven.world/pull/28),
[Bifrost PR #3](https://github.com/wheelofheaven/bifrost/pull/3), and
[documentation PR #3](https://github.com/wheelofheaven/docs.wheelofheaven.world/pull/3).
All four deployed 0.1 files passed coverage, canonical-shaping, and upstream-regression
checks; the main site built 10,999 pages and was checked in desktop and 390px mobile previews.
