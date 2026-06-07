+++
title = "Imported Translations (off-the-shelf scriptures)"
description = "Per-language choices for the off-the-shelf religious-text translations shipped alongside the WoH Translation Program output — what we picked, why, and the legal reasoning. Hebrew Bible focus."
weight = 55
+++

> **Three translation pipelines, three pages.**
>
> - **[i18n localisation](@/contributing/content/translations.md)** —
>   taking a Wheel of Heaven *English* page (wiki entry, Article,
>   Dispatch, etc.) and rendering it into the nine other site languages.
> - **[WoH Translation Program](@/contributing/content/source-text-translation/_index.md)**
>   — producing a fresh WoH-lens English translation of a religious or
>   mythological source-text (Hebrew, Greek, Akkadian, etc.) through the
>   Translator → Editor → Reviewer pipeline.
> - **This page: imported translations** — selecting which off-the-shelf
>   public-domain translation to ship for each site language, for the
>   religious texts where the WoH Translation Program output does not
>   (yet) exist. The user sees the WoH translation when available,
>   otherwise the imported translation, otherwise the source text.

## Scope of this page

We carry two kinds of translation under `data-library/{book}/`:

1. **WoH translations** (slug suffix `-woh`): produced by the WoH
   Translation Program. Render Elohim as *Elohim* (plural), preserve
   layered-witness sources, carry per-verse commentary keyed to a
   versioned glossary. These are the project's flagship output.
2. **Imported translations** (no suffix): off-the-shelf English versions
   of the same books, used as a comparison baseline + as fallback for
   any book we haven't translated yet under the WoH program. These are
   currently English-only — the rest of this page is the plan for
   extending them to the other eight site languages.

The Hebrew Bible is the focus because (a) it's the canonical-Raëlian
source corpus, (b) it has the highest WoH-translation coverage already,
so the imports here primarily serve as comparison reading. The same
methodology can extend to the NT and to the Qur'an later.

## What we're matching against

The English baseline for the imported Hebrew Bible is the
**American Standard Version (ASV) 1901**. We chose ASV because of its
unusually literal philosophy — it consciously stays close to the
Hebrew morphology, preserves the verb pattern, and resists doctrinal
smoothing. For each non-English site language, the question is:
*which public-domain translation has the strongest analogous
philosophy?*

Two constraints fence the answer:

1. **Public domain.** The project ships under `CC0-1.0`. Anything still
   under copyright is out unless the rights-holder publishes under a
   CC0-compatible licence (rare for Bible translations).
2. **Text-close, not paraphrase.** Dynamic-equivalence translations
   (NIV-style, *Good News*, "Common Language" series in most languages)
   miss the point. We want formal-equivalence in every target language.

## Per-language choices

| Lang | Choice | Year | Register | Notes |
|---|---|---|---|---|
| **en** | American Standard Version | 1901 | Early-20th-c. formal | Baseline. |
| **de** | Elberfelder 1905 ("alte Elberfelder") | 1905 | 19th-c. formal | Germany's literal-Reformed standard. Closer to ASV's philosophy than Luther. |
| **fr** | Crampon 1923 + PD Dhorme where extant | 1923 / 1910 / 1929 | Mid-register formal | Crampon baseline; Dhorme PD individual works (Samuel 1910, Job 1929) substitute where canonical-Raëlian source legally permits. |
| **es** | Reina-Valera 1909 | 1909 | Early-20th-c. formal | Literal-Reformed Spanish standard. |
| **ru** | Synodal 1876 | 1876 | Mid-19th-c. formal | Carries Orthodox theological vocabulary; flagged as a register caveat. |
| **ja** | 口語訳 1955 (Kougo-yaku) | 1955 | Modern colloquial-academic | Japan Bible Society publication. PD per JBS's own copyright statement. |
| **ko** | 개역성경 1938 | 1938 | Early-20th-c. literary | PD since 2012. Direct ancestor of the still-copyrighted 1961 revision. |
| **zh** + **zh-Hant** | Chinese Union Version (和合本) 1919 | 1919 | Early-20th-c. literary | Canonical Chinese Bible, now PD. Same text in both scripts. |
| **he** | Westminster Leningrad Codex | digital ed. | Tiberian Masoretic | The Hebrew source itself, already in repo as `data-library/genesis-woh/chapter-N.json` `text` field. |

## Per-language reasoning

### German — Elberfelder 1905

The "alte Elberfelder" (literally *Elberfeld old*, named for the
Wuppertal-Elberfeld translators) is Germany's closest analogue to ASV.
Originally produced by Brethren-movement scholars (1855 NT, 1871 OT)
who wanted a literal alternative to Luther, the 1905 revision is the
last public-domain edition before the 20th-c. revisions (1985 and 2003
revisions are still under copyright). Theological footprint is
minimal, the verb-pattern is preserved, and the *bara/asah/yatsar*
distinction in Genesis 1 is honoured.

Available digital text: Internet Archive multiple scans; community
ePub on Project Wittenberg-style hosting.

**Considered and rejected:**

- *Luther 1545 / Luther 1912*: theologically committed, not text-close
  in the ASV sense. Heavy interpretive moves.
- *Buber–Rosenzweig (1925–1961)*: brilliantly Hebraicizing but still
  copyrighted (Schocken/Lambert Schneider).
- *Schlachter 2000*: copyrighted (Genfer Bibelgesellschaft).

### French — Crampon 1923 (baseline) + PD Dhorme (Job, Samuel)

**Canonical-Raëlian context.** Raël has identified Édouard Dhorme's
Bible (Pléiade edition, Gallimard 1956–1959 for the Old Testament,
1971 for the NT) as the specific French text consulted during the
December 1973 encounter. The natural project choice would therefore be
Dhorme.

**The copyright wall.** Dhorme died in 1966. Under French copyright
(70 years post-mortem of last surviving author), the Pléiade Bible's
collaborator deaths push expiry to the 2030s for Dhorme's sole
contributions and ≈ 2071 for the joint work (Guillaumont d. 2000 is
the longest-surviving collaborator we've identified). The Pléiade is
firmly under Gallimard copyright today and cannot be shipped in a
CC0-1.0 repository.

**The workaround.** Dhorme published earlier *individual* commentaries
with translations in Gabalda's *Études Bibliques* series, before the
Pléiade project. Two of these are firmly public-domain and digitally
available:

- ***Les Livres de Samuel*** (1910) — Internet Archive, full PDF.
- ***Le Livre de Job*** (1929 second edition; the 1926 first edition is
  also PD) — Internet Archive, marked PDM 1.0, with full commentary
  apparatus.

These ship for Samuel + Job. For every other Hebrew Bible book,
**Crampon 1923** is the baseline. Crampon (Augustin Crampon,
1826–1894) translated from the original Hebrew + Greek; his work was
completed posthumously by collaborators (full Bible 1904; revised
1923, the canonical PD edition). Catholic literal register, fully
digitized on French Wikisource book-by-book, with the original
scans + transcribed parallel.

**The bibliographic acknowledgement.** Every book page surfaces a
footer note: *"Raël's December 1973 account references the Édouard
Dhorme Bible (Pléiade edition, Gallimard 1956–1959). Dhorme's
Genesis–Deuteronomy + other books in the Pléiade remain under Gallimard
copyright until ≈ 2071. This site ships the Crampon 1923 (public
domain) as the canonical French baseline, with Dhorme's pre-Pléiade
PD individual works (Samuel 1910, Job 1929) used where they exist.
Readers wishing to consult Dhorme's Genesis can obtain the Pléiade
volumes from Gallimard."*

**Considered and rejected:**

- *Darby French 1885-88 (Pau-Vevey)*: even more ASV-like in literal
  philosophy; rejected only because the Raël-Dhorme canonical link
  takes priority for French. Worth keeping in mind if Crampon's
  Catholic register proves a register-mismatch in practice.
- *Louis Segond 1880/1910*: more readable than Crampon, less literal.
- *Bible de Jérusalem 1956*: copyrighted (Cerf).

### Spanish — Reina-Valera 1909

The Reina-Valera (Casiodoro de Reina 1569, Cipriano de Valera 1602
revision) is the Spanish Protestant canon. The 1909 revision is the
last unambiguously public-domain edition — the 1960 revision is
copyrighted (United Bible Societies / Sociedad Bíblica), and the
1995/2009 revisions even more so. Literal philosophy in the
classical-Spanish-Reformed mould.

Available: BibleGateway, eBible.org, multiple PD distributions.

**Considered and rejected:**

- *Reina-Valera 1865 ("Valera 1865")*: even more literal but extremely
  archaic register. Available but probably too hard for modern readers.
- *Biblia de Jerusalén 1976*: copyrighted (Desclée de Brouwer).

### Russian — Synodal 1876

The Russian Synodal Translation, completed in 1876, is the only serious
public-domain option in Russian. Produced under the Holy Synod of the
Russian Orthodox Church, it carries Orthodox theological vocabulary
that flavors otherwise-literal renderings (Господь, Дух Святой,
Предание, etc.). Mid-19th-century register is dated but readable.

The 2011 Russian Bible Society modern translation is significantly
more accessible but copyrighted.

### Chinese — Chinese Union Version (和合本) 1919

The CUV (和合本, *Hé hé běn* "Union Version") is the canonical Chinese
Bible, produced by a multi-denominational committee 1890–1919. Two
streams exist — the "Union Mandarin" (literal) and "Easy Wenli"
(simpler classical) versions. The Union Mandarin is the one in
universal use today and is the literal-philosophy choice for our
purposes.

Same text serves both `zh` (Simplified Chinese) and `zh-Hant`
(Traditional Chinese) — the underlying characters are the same; the
two script variants differ only in glyph form, automatically
convertible.

PD status: corporate work published in 1919 under collective committee
authorship; expired in the early 1990s under the old 50-year rule and
remains PD under current Chinese copyright law.

### Japanese — 口語訳 1955 (Kougo-yaku)

**Why not 文語訳 1887?** The Meiji Bungo-yaku (1887 OT + 1917 Taishō
NT) is firmly public-domain but in Classical Japanese (文語). Modern
Japanese readers find it as opaque as English readers find Tyndale.
The literal-philosophy benefit is offset by the unreadability.

**口語訳 1955 verdict.** Japan Bible Society published the Colloquial
Japanese Bible (口語訳聖書, *Kougo-yaku Seisho*) in 1954 (NT) + 1955
(OT). This was the first modern-language Japanese Bible, designed
specifically to be readable in post-war colloquial Japanese while
staying close to the Hebrew and Greek source-texts.

JBS's own [copyright statement](https://www.bible.or.jp/read/bible_copyright.html)
declares that *"its copyright protection period has ended"*:

- Corporate/institutional-work rule (法人著作物): 50 years from publication
- 1955 + 50 = end of 2005, public-domain from 1 January 2006
- Japan's 2018 retroactive copyright extension (50 → 70 years) did NOT
  apply to works whose protection had already expired before
  30 December 2018

**Two caveats that affect how we ship it:**

1. **Moral rights persist in Japan in perpetuity** for the original
   authors. We can display the text verbatim, quote it, redistribute it
   — but **we cannot modify it**. No typo-fixes, no
   register-modernization, no editorial edits. Verbatim or nothing.
2. **Use the original 1955 first-printing text, not the corrected
   editions.** JBS publishes a *Bible Phrase Correction List*
   (聖書語句訂正一覧). The corrections themselves are still copyrighted,
   and any edition of 口語訳 that incorporates them is a JBS-licensed
   derivative. Source from a clean 1955-first-printing digitization
   (Japanese Wikisource is the canonical community-curated source).

### Korean — 개역성경 1938

**Why not 개역한글 1961 or 개역개정 1998?** Both are copyrighted by the
Korean Bible Society and remain so. The 1961 revision is what most
Korean readers know today, but it builds directly on 1938 and the
1938 text is independently available in the public domain.

**개역성경 1938.** The Joseon Bible Society's 1938 Old + New Testament
revision was the first major institutional revision of the
1900/1911 missionary Korean Bible. Copyright expired in 2012 per
[find.bible](https://find.bible/bibles/KORSYS/) and other public-domain
catalogues. Reasonably literal philosophy, early-20th-c. literary
register comparable to early-20th-c. English Bibles. The most-recent
public-domain Korean Bible available.

**Considered and rejected:**

- *Old Revised 1911*: even older PD option, but the 1938 revision is
  improved philologically and is the direct ancestor of all modern
  Korean Bibles.
- *공동번역 1977 / 새번역 / 우리말성경*: all copyrighted.

### Hebrew — Westminster Leningrad

Hebrew (`he`) is special: it's both a site language AND the source
language of the Hebrew Bible. The translation-target collapses to the
source text itself.

We use the **Westminster Leningrad Codex** digital edition of the
Masoretic Text — already in `data-library/{book}-woh/chapter-N.json` as
the per-paragraph `text` field. The library-book template displays
this verbatim when `detected_lang == "he"` and applies RTL rendering.

No separate "Hebrew imported translation" exists; the source text *is*
the rendering.

## Schema implications

### Catalog metadata

Existing English-only imports look like this in `catalog.json`:

```json
{
  "slug": "genesis",
  "tradition": "hebrew-bible",
  "originalLang": "he",
  "primaryLang": "en",
  "availableLangs": ["en"],
  "translationNote": "American Standard Version 1901 (public domain)"
}
```

Per-language imports extend `availableLangs` and add a per-language
provenance block:

```json
{
  "slug": "genesis",
  "tradition": "hebrew-bible",
  "originalLang": "he",
  "primaryLang": "en",
  "availableLangs": ["en", "de", "es", "fr", "ja", "ko", "ru", "zh", "zh-Hant"],
  "translations": {
    "en": { "name": "American Standard Version", "year": 1901, "license": "Public Domain" },
    "de": { "name": "Elberfelder 1905", "year": 1905, "license": "Public Domain" },
    "es": { "name": "Reina-Valera 1909", "year": 1909, "license": "Public Domain" },
    "fr": { "name": "Crampon", "year": 1923, "license": "Public Domain" },
    "ja": { "name": "口語訳 (Kougo-yaku)", "year": 1955, "license": "Public Domain (moral rights apply)" },
    "ko": { "name": "개역성경", "year": 1938, "license": "Public Domain" },
    "ru": { "name": "Synodal", "year": 1876, "license": "Public Domain" },
    "zh": { "name": "和合本 (Chinese Union Version)", "year": 1919, "license": "Public Domain" },
    "zh-Hant": { "name": "和合本 (Chinese Union Version)", "year": 1919, "license": "Public Domain" }
  }
}
```

Exception: for French Samuel + Job, the `fr` entry overrides to
Dhorme:

```json
{
  "slug": "1-samuel",
  "translations": {
    "fr": { "name": "Dhorme, Les Livres de Samuel", "year": 1910, "license": "Public Domain", "publisher": "Lecoffre (Études Bibliques)" }
  }
}
```

### Per-paragraph i18n

Same schema as the WoH translations: each paragraph carries an
`i18n.{lang}` field populated with the imported translation's
rendering of that verse. No `commentary` field — imported translations
are bare text. Glossary refs are not applied (the imports use their
own theological vocabulary, which the WoH glossary intentionally
disagrees with — applying glossary refs would create the wrong
association).

## Source-acquisition methodology

For each language + translation, we source from the most
text-authoritative public host:

| Lang | Primary source | Fallback |
|---|---|---|
| de Elberfelder 1905 | Internet Archive scans | de.wikisource.org |
| es Reina-Valera 1909 | eBible.org | Wikisource |
| fr Crampon 1923 | fr.wikisource.org (book-by-book) | Internet Archive PDF |
| fr Dhorme (Job, Samuel) | Internet Archive | — |
| ja 口語訳 1955 | ja.wikisource.org | ebstudio.info JIS X4081 |
| ko 개역성경 1938 | find.bible / Korean PD distributions | Internet Archive |
| ru Synodal 1876 | ru.wikisource.org | eBible.org |
| zh + zh-Hant CUV 1919 | zh.wikisource.org | eBible.org |

Every imported text records the source URL + accessed-on date in the
chapter JSON's `translation.sourceAccessedVia` field.

## Acknowledgement of register mismatch

All eight non-English PD choices are at least 60 years old, most over
100. Readers will encounter archaic German / Spanish / Russian /
Chinese / Korean register. This is the cost of the public-domain
constraint, accepted because:

1. The Hebrew Bible itself reads at archaic-register in any tradition
   that takes the text seriously. Modern dynamic-equivalence
   translations sand off the strangeness; the WoH project wants
   readers to *notice* the strangeness.
2. Each imported translation is paired with the WoH-lens English
   translation as the modern reference point. The imported text is
   the "what the standard text says" baseline, not the recommended
   reading.
3. As post-1955 translations enter the public domain over the next
   decades, this page will be revised. The Dhorme Pléiade enters PD
   around 2037-2071 (per collaborator deaths); the modern
   copyrighted translations follow on their own schedules.

## See also

- [WoH Translation Program](@/contributing/content/source-text-translation/_index.md)
  — the fresh-translation pipeline these imports complement.
- [i18n Localisation](@/contributing/content/translations.md) — fanning
  out WoH-produced English content into the nine other site languages.
- [Library Book](@/contributing/content/library-book.md) — the
  reader-facing format every translation (WoH or imported) ships
  inside.
