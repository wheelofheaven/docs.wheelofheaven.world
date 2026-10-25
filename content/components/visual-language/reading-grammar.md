+++
title = "Reading grammar"
description = "The one visual grammar every reading page follows: ink and hairlines, one accent, a mono metadata voice, one pill, serif for citations, and the rainbow in four fixed placements."
template = "page.html"
weight = 5
+++

Articles, wiki entries, timeline chapters, newsroom dispatches and library
book pages share one grammar since 2026-10-25. It lives in
[`sass/pages/_grammar.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/pages/_grammar.scss)
(tokens, mixins and the component rules every reading page has in common)
and one `_<page>-grammar.scss` file per page that places those rules on
that page's layout. The files load last in `main.scss`, so they layer over
the page stylesheets rather than replacing them.

## The rules

| Rule | What it means on the page |
| --- | --- |
| **One accent** | The accent colour appears on inline links and on the "copied" state of a copy button. Nothing else. Rules, markers and controls are ink, muted ink or a hairline. |
| **One metadata voice** | Every label, kicker, byline, attribution and sidebar heading is the `grammar-eyebrow`: iA Writer Quattro, 0.6875rem, letter-spaced caps, muted. Values set in the same face without the caps. |
| **One control** | Every button is the `grammar-pill`: a 999px hairline pill in the mono face. Copy, Read, edit history, agent buttons, share, chapter navigation. |
| **Serif means quotation** | Pulled quotes, library quotes, reference lists and the citation panels set in the citation serif. A quotation is a 2px muted rule on the left, no tint, no radius; its attribution speaks in the metadata voice. |
| **Hairline rows, not cards** | Read Next, see also, sources, related books and chapter navigation are rows separated by subtle hairlines. The index pages keep their cards. |
| **Three radii** | 0 for everything flat, 0.5rem for a panel (code blocks, cite formats, topic tiles), 999px for a pill. |
| **The headline** | Space Grotesk at weight 500, tight tracking, at most 16 characters wide, with the lede large and light beneath it. |

## The rainbow, in four places

The Bifrost rainbow (the pastel 300 band of the navbar and footer) is a
single token, `$grammar-rainbow`, and appears exactly four times on a page:

1. **A dash under the headline** (`grammar-rainbow-dash`, 5rem by 4px), between title and lede.
2. **Its twin above the end matter**, placed by the shared `content + *::before` rule so the body is bookended.
3. **The current chapter in the contents rail**, a vertical slice on the active entry, driven by `toc-scroll-spy.js`.
4. **The reading progress bar**, edge to edge across the top.

Behind the header a prism wash (`grammar-prism`) carries the same hues as
atmosphere: three radial tints, the 400 shades on dark paper and the 300s
on light, running edge to edge past the page gutters.

## The contents rail

Article, wiki, timeline and library pages mark the chapter being read.
`toc-scroll-spy.js` takes a table of page roots and uses a reading line
(the last linked heading 120px below the top of the viewport) rather than
intersection callbacks, so short chapters and clicked entries resolve the
same way as long ones, and the last chapter stays marked once the page is
scrolled out. The library reader marks its own list.

## Pages on the grammar

| Page | File | Notes |
| --- | --- | --- |
| Articles | `_article-grammar.scss` | Reading column with the contents rail on the right. |
| Wiki entries | `_wiki-grammar.scss` | Sidebar: portrait, infobox, names, metadata, then the contents list, then share and agent controls. |
| Timeline chapters | `_timeline-grammar.scss` | Same sidebar order; the age badge becomes a mono line under the headline. |
| Newsroom dispatches | `_dispatch-grammar.scss` | Single column; canon links and sources as rows. |
| Library book pages | `_library-grammar.scss` | Page chrome only; the reader is untouched. |
| Wiki index | `_wiki-index-grammar.scss` | Header and controls only; the cards keep their design. |
| About, info pages, FAQ, Press Kit | `_meta-grammar.scss` | One centred column; the Press Kit lives inside the info page and takes its header. |
| Sources index and records | `_sources-grammar.scss` | Rows with an eyebrow for the kind; records with a hairline sidebar. |

Index and landing pages (Articles, Newsroom, Library, Timeline, Contact,
Datasets) are not on the grammar; their cards and heroes stay as designed.

### Where the contents list sits

On wiki entries and timeline chapters an inline script in the page
template places the contents list: inline after the summary on phones,
and on desktop below the metadata block in the sidebar, above the share
and agent controls. The template markup matches that desktop order. The
scroll-spy scrolls the sidebar, the list's real scroll container, so the
current chapter stays in view.

## Fonts

The grammar introduced one face: **iA Writer Mono S**, the strictly
monospaced sibling of the Quattro the theme already used for its tech voice.
It is `$font-family-code` and sets text that is code proper, today the
BibTeX citation panel. See [Typography](@/components/tokens/typography.md).

## Adding a page to the grammar

1. Add the page root to `$grammar-pages` and its reading column to `$grammar-content` in `_grammar.scss`.
2. Create `_<page>-grammar.scss`: `@include grammar.grammar-prism` on the root, the header sequence, the rail mixins, the end-matter mixins.
3. If the page insets its sections with a margin rather than padding, set `&::before { left: 0 }` on that section so the dash sits on the text edge.
4. Buttons built on `glass-cloud-button` paint their clouds on `::before`/`::after`; set `content: none` on both when turning them into pills.
5. Add the page to the scroll-spy's `PAGES` table if it has a contents list, and rebuild the bundle.
