+++
title = "Source acquisition"
description = "Where to obtain openly-licensed pointed/transliterated source texts for Wheel of Heaven Translations, by tradition: Hebrew Bible, Greek NT, Akkadian/Sumerian, Egyptian, Qur'an, Pseudepigrapha. Plus the file format the project standardises on."
weight = 50
+++

A Wheel of Heaven Translation is only as good as its source.
This page lists the canonical openly-licensed source editions per
tradition, the access pattern for each, and the file format the
project stores them in.

The non-negotiable: the source must be either Public Domain, CC0,
or a project-cleared licence. A WoH Translation cannot rest on a
copyrighted critical edition; the project's audit trail requires
that any reader can re-fetch the source themselves and verify the
pointed/transliterated text the translation is built from.

## Hebrew Bible

### Canonical source

**Tanach with Ta'amei Hamikra (Westminster Leningrad Codex with
vowel points and cantillation marks).**

- **Edition.** The Westminster Leningrad Codex is the standard
  modern critical edition of the Hebrew Bible. The
  "Tanach with Ta'amei Hamikra" variant adds the cantillation
  marks (the *te'amim*), which the project preserves in source
  files because they affect translation choices (athnach, pasuq,
  zaqef, etc. mark major syntactic divisions that English
  punctuation should reflect).
- **License.** Public Domain.
- **Authoritative URL.** <http://www.tanach.us/Tanach.xml>
- **Practical access.** The Sefaria public API at
  `sefaria.org/api/v3/texts/{Book}.{Chapter}` returns clean JSON
  with the pointed Hebrew and verse divisions. The Sefaria text
  edition `"Tanach with Ta'amei Hamikra"` should be specified to
  get the cantillated form.
- **Refid convention.** `{BOOK-CODE}-{chapter}:{verse}`, e.g.
  `GEN-1:1`. Book codes follow the SBL Handbook abbreviations
  (`GEN`, `EXO`, `LEV`, `NUM`, `DEU`, `JOS`, `JDG`, `RUT`, `1SA`,
  `2SA`, `1KI`, `2KI`, `1CH`, `2CH`, `EZR`, `NEH`, `EST`, `JOB`,
  `PSA`, `PRO`, `ECC`, `SNG`, `ISA`, `JER`, `LAM`, `EZK`, `DAN`,
  `HOS`, `JOL`, `AMO`, `OBA`, `JON`, `MIC`, `NAM`, `HAB`, `ZEP`,
  `HAG`, `ZEC`, `MAL`).

### Reference PD translations

For the Translator's fallback (where the glossary is silent):

- **American Standard Version (ASV) 1901.** The current
  WoH-project reference for Hebrew Bible Translator-default.
  Public Domain. Available via Sefaria, BibleGateway, and many
  others. Closest 20th-century formal-equivalence translation
  free of copyright.
- **Optional second reference:** the JPS 1917 Tanakh (Public
  Domain) for Jewish-tradition readings, especially the
  primaeval-history section where it diverges from Christian
  translations.

### Lexical reference (Editor and Reviewer use)

- **BDB** — Brown-Driver-Briggs, *A Hebrew and English Lexicon of
  the Old Testament*. Public Domain.
- **HALOT** — Koehler-Baumgartner, *The Hebrew and Aramaic
  Lexicon of the Old Testament*. Copyrighted; project access via
  scholarly references only.
- **NIDOTTE** — VanGemeren (ed.), *New International Dictionary
  of Old Testament Theology and Exegesis*. Copyrighted.
- **TDOT** — Botterweck-Ringgren, *Theological Dictionary of the
  Old Testament*. Copyrighted.

## Greek New Testament

### Canonical source

**Tregelles Greek New Testament (1857–1879).**

- **Edition.** Samuel Prideaux Tregelles' critical edition; the
  oldest Public Domain critical edition of the Greek NT. Available
  in transcription via the Tyndale House STEP project.
- **License.** Public Domain.
- **Authoritative URL.** Tyndale House STEP Bible project
  (<https://stepbible.org/>).
- **Practical access.** STEP Bible API; also OpenText resources.

### Alternative source

**SBLGNT — SBL Greek New Testament (2010).**

- **Edition.** Society of Biblical Literature edition, Michael W.
  Holmes (ed.).
- **License.** Free for non-commercial scholarly use; commercial
  redistribution requires SBL permission. The WoH project is CC0
  and would need SBL clearance for direct redistribution of the
  text body.
- **Status.** Use as scholarly reference but not as the source
  text the project ships.

### Reference PD translations

- **King James Version (KJV) 1611/1769.** Public Domain.
- **American Standard Version (ASV) 1901.** Public Domain.
- **Tregelles' own English New Testament**, where it exists. Public
  Domain.

### Lexical reference

- **BDAG** — Bauer-Danker-Arndt-Gingrich, *A Greek-English Lexicon
  of the New Testament*. Copyrighted.
- **LSJ** — Liddell-Scott-Jones, *A Greek-English Lexicon*. Public
  Domain (older editions). The 9th edition supplements are
  copyrighted.
- **Louw-Nida** — *Greek-English Lexicon Based on Semantic
  Domains*. Copyrighted.
- **Thayer's** — Joseph Thayer, *Greek-English Lexicon of the New
  Testament*. Public Domain. Older and weaker than BDAG but
  citable.

### Refid convention

`{BOOK-CODE}-{chapter}:{verse}`, e.g. `MAT-13:3`, `JOH-1:1`,
`REV-4:1`. SBL Handbook book codes (`MAT`, `MRK`, `LUK`, `JOH`,
`ACT`, `ROM`, `1CO`, `2CO`, `GAL`, `EPH`, `PHP`, `COL`, `1TH`,
`2TH`, `1TI`, `2TI`, `TIT`, `PHM`, `HEB`, `JAS`, `1PE`, `2PE`,
`1JN`, `2JN`, `3JN`, `JUD`, `REV`).

## Akkadian (Mesopotamian)

### Canonical sources

**CDLI (Cuneiform Digital Library Initiative).**

- **Resource.** Comprehensive transliterations of cuneiform texts
  with metadata. Lookups via CDLI numbers (P-numbers).
- **License.** CC-BY-NC-SA for the texts; attribution required.
  Project status: can be used as reference; for shipping in the
  Library a project-cleared agreement may be needed for some
  specific texts.
- **URL.** <https://cdli.mpiwg-berlin.mpg.de/>

**ETCSL (Electronic Text Corpus of Sumerian Literature) — also
includes some Akkadian.**

- **Resource.** Oxford's comprehensive Sumerian text corpus with
  English translations.
- **License.** Open for scholarly use; project use compatible.
- **URL.** <https://etcsl.orinst.ox.ac.uk/>

**Open Richly Annotated Cuneiform Corpus (ORACC).**

- **Resource.** Critical-edition-style transliterations of
  Akkadian and Sumerian texts with lemma-level annotation.
- **License.** Project-by-project; most are open access. Verify
  per text.
- **URL.** <http://oracc.museum.upenn.edu/>

### Reference scholarly editions

- **Andrew George, *The Babylonian Gilgamesh Epic* (2003).** The
  standard critical edition of Gilgamesh. Copyrighted (Oxford
  University Press). Use as scholarly reference; do not ship.
- **Benjamin Foster, *Before the Muses* (3rd ed., 2005).** The
  standard English anthology of Akkadian literature.
  Copyrighted. Reference only.
- **Stephanie Dalley, *Myths from Mesopotamia* (1989, rev.
  2008).** Standard mid-academic English translation of Akkadian
  myths including Atrahasis, Enuma Elish, Gilgamesh. Copyrighted.

### Lexical reference

- **CAD** — *Chicago Assyrian Dictionary*. Open access:
  <https://isac.uchicago.edu/research/publications/chicago-assyrian-dictionary>.
  Comprehensive lexicon; PDF volumes downloadable.
- **AHw** — *Akkadisches Handwörterbuch* (von Soden). Copyrighted
  print only.

### Refid convention

For Gilgamesh: `GILG-{tablet-roman}:{line}`, e.g.
`GILG-XI:14` for Tablet XI line 14. Tablets are Roman numerals
(I–XII); the late Tablet XII is the appendix.

For other texts, use the project's source code (e.g. `ATRA` for
Atrahasis, `ENUM` for Enuma Elish) + standardised line numbering
per the critical edition.

## Sumerian

### Canonical source

**ETCSL (Electronic Text Corpus of Sumerian Literature).**

- **Resource.** Oxford-based corpus with line-by-line
  transliterations and English translations.
- **License.** Open for scholarly use.
- **URL.** <https://etcsl.orinst.ox.ac.uk/>
- **Refid convention.** `{ETCSL-id}-{line}`, e.g.
  `ETCSL-1.7.4-15` for line 15 of *The Eridu Genesis* (ETCSL
  1.7.4). Or use the project's own slug code (`ERID` for
  Eridu Genesis, `ATRA` for Atrahasis Sumerian fragments).

### Lexical reference

- **ePSD2** — *Electronic Pennsylvania Sumerian Dictionary*. Open
  access at <http://oracc.museum.upenn.edu/epsd2/>.

## Egyptian (Pyramid Texts, Memphite Theology, etc.)

### Canonical source

**Open critical editions where available; specific PD older
editions for canonical Pyramid Text and Coffin Text material.**

- **Sethe, *Die altägyptischen Pyramidentexte* (1908–1922).**
  Public Domain.
- **Faulkner, *The Ancient Egyptian Pyramid Texts* (1969).**
  English translation; copyrighted.
- **Allen, *The Ancient Egyptian Pyramid Texts* (2005).** Modern
  English translation; copyrighted.

### Lexical reference

- **Faulkner, *A Concise Dictionary of Middle Egyptian* (1962).**
  Standard for working purposes; copyrighted.
- **Gardiner, *Egyptian Grammar* (3rd ed., 1957).** Standard
  grammar; copyrighted.

### Refid convention

`{TEXT-CODE}-{spell-id}:{line}`, e.g. `PT-228:1` for Pyramid Text
Utterance 228 line 1.

## Qur'an (Arabic)

### Canonical source

**Tanzil.net.**

- **Resource.** Free, open Arabic Qur'an in multiple recensions
  (the standard Hafs from `Asim, Warsh from Nafi`, etc.). The
  default is the Uthmanic/Hafs text.
- **License.** Open for scholarly use; attribution required.
- **URL.** <https://tanzil.net/>
- **Refid convention.** `QUR-{sura}:{ayah}`, e.g. `QUR-21:1`,
  `QUR-54:1`, `QUR-56:15`.

### Reference PD translations

- **George Sale, *The Koran* (1734).** Oldest English translation
  of academic seriousness. Public Domain.
- **John Medows Rodwell, *The Koran* (1861).** Public Domain.
- **E. H. Palmer, *The Qur'an* (1880).** Public Domain.
- **Marmaduke Pickthall, *The Meaning of the Glorious Koran*
  (1930).** Public Domain in most jurisdictions.
- **Abdullah Yusuf Ali, *The Holy Qur'an* (1934).** Public
  Domain.

### Lexical reference

- **Lane, *An Arabic-English Lexicon* (1863–1893).** Public
  Domain. Comprehensive classical Arabic lexicon; available at
  <http://www.tyndalearchive.com/tabs/lane/>.
- **Hava, *Arabic-English Dictionary* (1899).** Public Domain.
- **Wehr-Cowan, *A Dictionary of Modern Written Arabic*.** Modern
  reference; copyrighted.

### Special notes

The Qur'an translation work requires extra care for tradition-
respect:

- The project's Translation track is technically possible (working
  from Arabic with a transliteration map) but the Edition track
  (working from a PD English translation, applying the WoH
  glossary) is more commonly the right approach because the
  Arabic text is liturgical and the project does not benefit from
  a fresh Arabic-to-English rendering.
- Carve-outs for divine names (Allah, ar-Rahman, ar-Rahim) and
  the Throne (al-`Arsh) should be made explicit and conservative.
- The project should consult Muslim scholarship before shipping
  any speculative readings of Qur'anic verses.

## Pseudepigrapha (Book of Enoch, Jubilees, etc.)

### Canonical sources

**1 Enoch (Ethiopic):**

- **Charles, *The Book of Enoch* (1912).** Public Domain. The
  standard English translation through the 20th century;
  superseded scholarly by Nickelsburg/VanderKam but still cited.
- **Knibb, *The Ethiopic Book of Enoch* (1978).** Copyrighted.
  Scholarly reference only.
- **Nickelsburg, *1 Enoch 1: A Commentary on the Book of 1 Enoch,
  Chapters 1–36; 81–108* (2001).** Hermeneia. Copyrighted.
  Scholarly reference only.

**Jubilees:**

- **Charles, *The Book of Jubilees* (1902).** Public Domain.
- **VanderKam, *The Book of Jubilees* (1989).** Copyrighted.

### Refid convention

`ENO-{chapter}:{verse}` for 1 Enoch. `JUB-{chapter}:{verse}` for
Jubilees.

## Source file format

All source files in `data-library/{book-slug}/source-{lang}-{N}.json`
follow this schema:

```json
{
  "schemaVersion": 2,
  "bookSlug": "<book slug>",
  "chapter": <number>,
  "source": {
    "type": "<masoretic-text | greek-critical | akkadian-transliteration | sumerian-etcsl | arabic-uthmanic | egyptian-hieroglyphic | ...>",
    "versionTitle": "<canonical name of the edition>",
    "license": "<Public Domain | CC0 | CC-BY-SA | ...>",
    "versionSource": "<canonical URL of the edition>",
    "fetchedFrom": "<where the project actually pulled it from>",
    "fetchedAt": "<ISO date>"
  },
  "verses": [
    {
      "n": 1,
      "refId": "<CODE>-<chapter>:<verse>",
      "<lang>": "<source-language verbatim>"
    }
  ]
}
```

The source file is **immutable** once committed. If the underlying
edition is updated (rare), a new source file is created with a
new fetch date; the prior file is preserved.

`{lang}` in the verse object is the ISO 639-1 / -3 code: `he` for
Hebrew, `grc` for ancient Greek, `akk` for Akkadian, `sux` for
Sumerian, `arb` for Arabic, `egy` for Egyptian, `gez` for
Ge'ez (Ethiopic).

## Acquisition checklist (per new book)

Before starting a new WoH Translation book:

- [ ] Identify the canonical Public Domain or
      project-cleared-licence edition.
- [ ] Verify the licence in writing; record it in the source
      file's `source.license` field.
- [ ] Identify the reference PD English translation the
      Translator agent will fall back to.
- [ ] Confirm the refId convention with the project (book code,
      verse numbering).
- [ ] Pull the first chapter's source text into
      `data-library/{book-slug}/source-{lang}-1.json`.
- [ ] Verify the source file round-trips: re-fetch from the
      canonical URL and confirm the text matches.
- [ ] Scaffold `_meta.json` with the book metadata.

Only then is the project ready to invoke the Translator agent.
