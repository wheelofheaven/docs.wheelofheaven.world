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

## Ugaritic (Levantine)

### Canonical source

**Copenhagen Ugaritic Corpus (CUC) — Text-Fabric dataset.**

- **Resource.** Consonantal Latin transliteration of 278 tablets
  with line / column / side annotation, including the complete
  Baal Cycle (KTU 1.1–1.7), Aqhat, Kirta, Rephaim, and Shachar &
  Shalim.
- **Licence.** **CC BY-NC 4.0.** Working base for in-house
  translation only; do not republish the transliteration verbatim
  under CC0. A book whose `source-uga-N.json` was built from CUC
  declares a `licensing` block on `_meta.json` recording the
  upstream NC term.
- **URL.** <https://github.com/DT-UCPH/cuc> (Zenodo DOI:
  10.5281/zenodo.10695308).
- **Refid convention.** KTU-anchored: `{CODE}-{tablet}:{column}:{line}`,
  e.g. `BAAL-1.3.i:5` or the simplified `AQHT-17:1`. The
  `baal-cycle-woh` book is the established precedent.

### Reference scholarly editions

- **KTU³** (Dietrich-Loretz-Sanmartín 2013) — the standard
  edition; copyrighted, reference only.
- **Smith & Pitard, *The Ugaritic Baal Cycle*, vol. 2 (Brill
  2009)** — definitive for KTU 1.3–1.4. Copyrighted.
- **Pardee, *The Baʿlu Myth* in COS vol. 1 (Brill 2003)** —
  copyrighted.
- **Virolleaud, *Syria* 12+ (1931 onwards)** — editiones
  principes; **enter US PD on a rolling 95-year schedule, Syria 12
  in Jan 2027**. Worth waiting for the start of an Ugaritic PD
  shelf.
- **Gibson, *Canaanite Myths and Legends* (Edinburgh 1978)** —
  copyrighted but heavily relied upon.

### Lexical reference

- **del Olmo Lete & Sanmartín, *A Dictionary of the Ugaritic
  Language in the Alphabetic Tradition* (DULAT)** — Brill,
  copyrighted.
- **Sivan, *A Grammar of the Ugaritic Language*** — copyrighted.

## Hittite and Hurrian (Anatolian)

### Canonical source

**Hethitologie-Portal Mainz (HPM) / *Mythen der Hethiter*
editions.**

- **Resource.** E. Rieken et al. line-by-line edition (partitura
  with German translation) of the Hittite mythological corpus —
  Kumarbi cycle (CTH 344, 345, 348, 364), Illuyanka (321),
  Telipinu (324), Elkunirša and Ašertu (342). Open access via the
  HPM portal.
- **Licence.** No Creative Commons licence stated. Treat as **FREE
  with open-access posture** — citation expected, redistribution
  permission requested explicitly per the
  [acquisition-program licence policy](@/contributing/content/library-acquisition.md#source-licence-classes).
- **URL.** <https://hethport.net/txhet_myth/textindex.php> (the old
  hethport.uni-wuerzburg.de URLs redirect here).
- **Refid convention.** `{CODE}-{tablet}:{line}` with the CTH
  number recorded in `_meta.json.composition`, e.g.
  `EMRG-1:18` (CTH 344 Song of Emergence).

### PD transliterations

- **E. Forrer, *Die Boghazköi-Texte in Umschrift* (1922/1926).**
  Public Domain; on Archive.org. Covers Old-Hittite-era tablets
  only — fine for Illuyanka and Telipinu fragments, not for the
  Kumarbi cycle (first published 1946+).
- **KUB / KBo cuneiform autographs pre-1931.** Public Domain.

### Reference scholarly editions

- **Güterbock, *Kumarbi* (1946) + *JCS* Ullikummi edition
  (1951–52).** Copyrighted; URAA-restored.
- **Hoffner, *Hittite Myths* (2nd ed., 1998).** Copyrighted.

**Known gap: CTH 789 (Song of Release).** The only open edition
is E. Neu, *StBoT* 32 (1996) — copyrighted. No alternative
identified; the text is BLOCKED until either an open edition
appears or hethport.net adds it.

### Lexical reference

- **HW² — Hethitisches Wörterbuch** (Friedrich-Kammenhuber).
  Copyrighted; partial.
- **CHD — Chicago Hittite Dictionary.** Partial fascicles;
  copyrighted.

## Avestan and Pahlavi (Persian / Zoroastrian)

### Canonical sources

**Geldner, *Avesta, the Sacred Books of the Parsis* (1886–96).**

- **Edition.** The standard critical edition of the Avestan
  scriptures (Yasna including the Gathas, Vendidad, Yashts).
  Three volumes.
- **Licence.** Public Domain everywhere.
- **Practical access.** **avesta.org** (Joseph H. Peterson)
  presents Geldner-based romanized Avestan in HTML; the site
  apparatus carries Peterson's copyright, but a faithful
  transcription of the PD Geldner text is itself PD. For clean
  provenance, key from the Geldner volumes on Archive.org and
  treat avesta.org as a collation aid.
- **TITUS Avestan corpus** is **closed** ("no parts… may be
  republished without prior permission") — reference only.

### PD English translations

- **Darmesteter, *The Zend-Avesta*, SBE 4 (1880) and SBE 23
  (1883).** Public Domain.
- **Mills, *The Zend-Avesta, Part III: the Yasna, Visparad,
  Âfrînagân, Gâhs, and Miscellaneous Fragments*, SBE 31 (1887).**
  Public Domain. The standard PD Gathas translation.
- **West, *Pahlavi Texts*, SBE 5 (1880) + SBE 18, 24, 37, 47.**
  Public Domain. Indian recension of the Bundahishn and other
  Pahlavi texts.

### Pahlavi gaps

The **Greater (Iranian) Bundahishn** and **Selections of
Zadspram** have no openly-licensed machine-readable original. The
PD basis is T. D. Anklesaria's facsimile of MS TD2 (1908). B. T.
Anklesaria's 1956 transcription and 1964 Zadspram edition are
copyrighted. Treat these texts as Pahlavi-pilot work pending
direct transcription from the TD2 facsimile, or wait for an open
edition.

### Refid convention

`VID-{fargard}:{verse}` for Vendidad (e.g. `VID-2:21`).
`YAS-{chapter}:{stanza}` for Yasna, e.g. `YAS-30:3` (Gatha
Ahunavaiti); `YT-{number}:{stanza}` for Yashts (e.g. `YT-19:35`
Zamyad). `BUND-{chapter}:{section}` for Bundahishn.

## Greek (classical)

For the Greek New Testament see the dedicated section above. For
classical Greek mythography, philosophy, and historiography:

### Canonical sources

**Perseus canonical-greekLit + Open Greek and Latin / First1KGreek.**

- **Resource.** TEI XML editions of the major Greek authors at
  <https://github.com/PerseusDL/canonical-greekLit> and
  <https://github.com/OpenGreekAndLatin/First1KGreek>. Direct file
  paths use TLG identifiers, e.g.
  `data/tlg0020/tlg001/tlg0020.tlg001.perseus-grc2.xml` for
  Hesiod's Theogony.
- **Licence.** **CC BY-SA 4.0** (older files CC BY-SA 3.0).
- **Practical access.** Both the Scaife reader
  (<https://scaife.perseus.org/>) and direct raw-XML fetches from
  GitHub. The TEI `<l>` elements carry the canonical line
  numbering.
- **Refid convention.** Line numbers for poetry (`THEO-116`,
  `ERGA-109`); Stephanus pagination for Plato (`TIM-22b`,
  `CRI-113c`); book.chapter.section for prose (Diodorus
  `DIOD-1.10.1`).

### PD print bases

- **Rzach, *Hesiodi Carmina*** (Teubner 1902) for Hesiod.
- **Burnet, *Platonis Opera*** (OCT 1900–1907) for Plato — the
  same text Perseus serves.
- **Allen, *Homeri Opera*** vol. V (OCT 1912) for the Homeric
  Hymns.
- **Vogel, *Diodori Bibliotheca Historica*** (Teubner 1888).
- **Wagner, *Apollodori Bibliotheca*** (Teubner 1894).

### PD English translations

- **Evelyn-White, *Hesiod, the Homeric Hymns and Homerica***
  (Loeb 1914). Public Domain.
- **Jowett, *The Dialogues of Plato*** (1892). Public Domain.
- **Smyth, *Aeschylus*** (Loeb 1926). Public Domain.
- **Frazer, *Apollodorus*** (Loeb 1921). Public Domain.
- **Oldfather, *Diodorus Siculus*** (Loeb vols, 1933+) —
  **copyright not renewed → PD-US**; full text hosted on Bill
  Thayer's LacusCurtius.

### Hellenistic witnesses

- **Berossus, *Babyloniaca*** (fragments via Syncellus, Eusebius,
  Müller FHG II). All carriers PD. PD English: Cory, *Ancient
  Fragments* (1832). Modern editions (Burstein 1978,
  Verbrugghe-Wickersham 1996) copyrighted.
- **Philo of Byblos / Sanchuniathon** (via Eusebius *PE* I.9–10).
  PD Greek: Gifford 1903 (full PE) on Archive.org;
  First1KGreek tlg2018 (CC BY-SA). PD English: Gifford 1903; Cory
  1832.

### Lexical reference

- **LSJ — Liddell-Scott-Jones**, older editions PD; 9th edition
  supplements copyrighted.
- **LSI — Liddell-Scott Intermediate** (1889). Public Domain.

## Coptic (Gnostic / Nag Hammadi)

### Canonical sources

**Coptic Scriptorium corpora.**

- **Resource.** TEI / ANNIS / CoNLL-U annotated Coptic texts;
  CC BY (variable per corpus). Verified usable corpora for the
  Library: `thomas-gospel` (NHC II,2 Gospel of Thomas — Dilley
  edition) and `pistis-sophia` (Askew Codex).
- **Licence.** **CC BY 4.0** for the documents named above (the
  corpora README lists the per-document licence).
- **URL.** <https://github.com/CopticScriptorium/corpora>.
- **Refid convention.** Logion number for Thomas (`THOM-77`);
  Schmidt chapter for Pistis Sophia (`PIST-1:7`); codex
  page.line for other tractates (`AJOH-11:18`).

### PD Coptic editions

- **Schwartze & Petermann, *Pistis Sophia*** (1851) — Coptic with
  Latin translation. Public Domain.
- **C. Schmidt, *Pistis Sophia*** Coptic edition (1925 *Coptica*
  II). PD-US.

### PD English

- **G. R. S. Mead, *Pistis Sophia*** (1921, 2nd ed.). Public
  Domain.
- **Horner, Coptic NT and Pistis Sophia partial translations**
  (1911–1924). Public Domain.

### Tractates with no open Coptic edition

For NHC tractates beyond Thomas and Pistis Sophia (Apocryphon of
John, Hypostasis of the Archons, On the Origin of the World,
Eugnostos / Sophia of Jesus Christ), no openly-licensed Coptic
transcription exists. The standard print editions (Krause-Labib
1962; Till-Schenke 1972; Waldstein-Wisse 1995; Layton 1974;
Bullard 1970) are all copyrighted. The **Marcion project**
(<https://marcion.sourceforge.net/>, GPL v2) collates from these
prints — usable as a working aid but the transcriptions of
*reconstructed* passages carry residual edition rights.
Translator posture: transcribe from the facsimile codex images,
treat Marcion as collation.

### Lexical reference

- **Crum, *A Coptic Dictionary*** (Oxford 1939). PD-US; the
  standard for Sahidic.

## Old Church Slavonic (Slavic apocrypha)

**2 Enoch, the Apocalypse of Abraham, and related material.**

- **Sokolov, *Slavonic Book of Enoch* / *Книга тайн Еноха***
  (Moscow 1910, posthumous edited by Speranskij). Public Domain;
  scans via Archive.org and national libraries.
- **Popov 1880** (earlier Slavonic edition). Public Domain.
- **Sreznevsky / Tikhonravov** Slavonic editions of the
  Apocalypse of Abraham. Public Domain (verification per scan
  pending).
- **Charles & Morfill, *The Book of the Secrets of Enoch*** (1896)
  and **Forbes-Charles, APOT vol. II** (1913). Public Domain
  English.
- **Box, *The Apocalypse of Abraham*** (SPCK 1918). Public
  Domain.

Refid convention: `2EN-{chapter}:{verse}` (declare long vs. short
recension per verse), `APAB-{chapter}:{verse}`.

## Persian and Arabic (Bahá'í)

### Canonical sources

The Bahá'í scriptural corpus — Bahá'u'lláh (d. 1892), the Báb
(d. 1850), 'Abdu'l-Bahá (d. 1921) — is fully PD by author-death
calculation. The **Bahá'í World Centre's authorised English
translations are copyrighted**; the Persian and Arabic originals
are not.

- **H-Bahai** (Michigan State University, H-Net) hosts scans of
  19th-/early-20th-century lithographs and the INBA (Iran
  National Bahá'í Archives) facsimile series. <https://www.h-net.org/~bahai/>
- **Afnan Library** hosts the digitised INBA series.
  <https://afnanlibrary.org/inba/>
- **Ocean of Lights** hosts machine-readable originals alongside
  provisional translations. <https://oceanoflights.org/>
- **bahai-library.com** hosts originals and the multilinear
  Aqdas project.
- The Bahá'í Reference Library (bahai.org/library) carries PDF
  downloads of the BWC's typeset Arabic and Persian editions, but
  the BWC asserts copyright over its typesetting / compilation —
  practical posture: **transcribe from PD lithographs / INBA
  facsimiles, treat the BWC e-texts as collation aid only**.

### Licence posture

The underlying words are PD by author-death calculation. The BWC's
copyright claim attaches to its editions, not to the underlying
text. The acquisition program's practical rule: prefer the
lithograph-derived transcriptions for clean CC0 provenance.

### Sensitivity

The Bahá'í community is textually meticulous and the BWC's
authorised translations are considered authoritative within the
faith. WoH translations are unofficial, independent of the
authorised renderings, and stated as such in the methodology note
of every Bahá'í book.

### Refid convention

Aphoristic works number serially: `HWA-{n}` for the Arabic Hidden
Words, `HWP-{n}` for the Persian Hidden Words. Treatises use
paragraph numbering: `IQAN-1:13`.

## Vietnamese (Caodai)

**Đạo Cao Đài canonical texts.**

- **Resource.** The diaspora archive **daotam.info** hosts
  machine-readable Vietnamese HTML of Thánh Ngôn Hiệp Tuyển
  (both volumes), Pháp Chánh Truyền, Tân Luật, Kinh Thiên Đạo và
  Thế Đạo, and Con Đường Thiêng Liêng Hằng Sống.
- **Licence.** Vietnam: life+50. Vol. 1 (1928) and the
  constitutional texts (1926–27) are PD in Vietnam since at least
  2010. Vol. 2 (1963) and post-1948 Phạm Công Tắc material carry
  more complex status (anonymous-works rule, US URAA
  considerations) — flagged per book. No formal licence statement
  on daotam.info — treat as religious commons; courtesy contact
  with the archive accompanies use of the source layer.
- **URL.** <https://www.daotam.info/>
- **Refid convention.** `TNHT-{vol}:{n}` for Thánh Ngôn Hiệp
  Tuyển, where `n` numbers the paragraph of the message and the
  date appears in `source.messages` metadata. The first opened
  book is the established precedent.

## Japanese (Oomoto)

**Oomoto Shin'yu (大本神諭) and Reikai Monogatari (霊界物語).**

- **Resource.** **reikaimonogatari.net** — the de-facto open
  corpus, maintained by researcher Iizuka Hiroaki. Full text of
  the Oomoto Shin'yu (index `obc=os`) and all 81 volumes of the
  Reikai Monogatari, with bulk downloads.
- **Licence.** Japan: life+50 for authors who died before 1968.
  Deguchi Nao (d. 1918) and Deguchi Onisaburō (d. 1948) are both
  fully PD in Japan. **US URAA caveat:** Reikai Monogatari
  volumes published 1929–34 do not enter the US PD until
  ~2025–2030 on a rolling 95-year schedule; sequence US-hosted
  publication accordingly.
- **URL.** <https://reikaimonogatari.net/> /
  <https://reikaimonogatari.net/dl.php> (bulk).
- **Refid convention.** `OSHIN-{year}:{n}` for dated Shin'yu
  oracles, `RM-{volume}:{chapter}:{n}` for Reikai Monogatari.

## Sanskrit (Vedic / Indic)

- **VedaWeb** (Universität zu Köln) — TEI dataset of the Rig
  Veda with per-version CC licences declared in the teiHeader.
  <https://vedaweb.uni-koeln.de/>; data on Zenodo DOI 4601264.
  Verify per-version licence before ingest.
- **Aufrecht, *Die Hymnen des Rigveda*** (2nd ed. 1877).
  Romanized Saṃhitā text; Public Domain everywhere.
- **Griffith, *The Hymns of the Ṛgveda*** (1889–92). Public
  Domain English (sacred-texts).
- **Eggeling, *The Śatapatha-Brāhmaṇa*** SBE 12, 26, 41, 43, 44
  (1882–1900). Public Domain.
- **Telang, *The Bhagavadgītā*** SBE 8 (1882) and **Arnold, *The
  Song Celestial*** (1885). Public Domain.
- **GRETIL** (Göttingen) hosts many Sanskrit e-texts but has no
  uniform licence — verify per file. The Mahābhārata electronic
  text (Tokunaga / Smith) is "free for scholarly, non-commercial
  use" — **not** CC0-ingestable; the project's Sanskrit work
  uses targeted Rig Veda + Śatapatha Brāhmaṇa selections only.

Refid convention: `RV-{maṇḍala}.{sūkta}:{ṛc}` (e.g.
`RV-10.129:4`); `BG-{chapter}:{śloka}`; `SB-{kāṇḍa}.{prapāṭhaka}.{brāhmaṇa}.{kaṇḍikā}`.

## Akkadian (extension)

Beyond the canonical Akkadian sources already documented above
(CDLI, ETCSL, ORACC), the **electronic Babylonian Library (eBL)**
at LMU Munich provides full critical editions of every Akkadian
epic on the project's queue — Atrahasis (L.1.1), Enuma Elish
(L.1.2), Erra and Ishum (L.1.5), Descent of Ishtar (L.1.8), Etana
(L.1.9), Anzu (L.1.10).

- **Licence.** **CC BY-NC-SA 4.0.** Working base for in-house
  translation; the resulting book inherits the NC term via the
  `licensing` block on `_meta.json` — the Atrahasis translation
  is the first such case in the corpus.
- **URL.** <https://www.ebl.lmu.de/>
- **Companion:** **SEAL — Sources of Early Akkadian Literature**
  (Hebrew University; <https://seal.huji.ac.il/>), **CC BY-NC-ND**;
  reference / collation only.

Refid convention follows the eBL line numbering, which itself
matches the established Lambert-Millard (Atrahasis), Lambert
(Anzu / Erra), Foster anthology line numbers per text. Tablet
roman numerals + line: `ATRA-I:1`, `ENUM-IV:18`.

## Egyptian (extension)

Beyond the PD basis (Sethe, Naville, Budge) already documented:

- **Thesaurus Linguae Aegyptiae (TLA).** The site itself is
  partially restricted (no full sub-corpora reuse). But **TLA
  publishes raw-data corpus dumps on HuggingFace under
  CC BY-SA 4.0** —
  `thesaurus-linguae-aegyptiae/tla-Earlier_Egyptian_original-v18-premium`
  and sibling datasets, with lemmatised transliteration and
  German translation. This is the open Egyptian pipeline.
- **Coffin Texts.** A. de Buck, OIP 34–87 (1935–1961) — free PDFs
  from ISAC (isac.uchicago.edu) but **copyright Univ. of
  Chicago**; treat as gratis reference only. TLA HF dump
  covers many CT spells under CC BY-SA.

Refid convention: `PT-{utterance}:{line}` for Pyramid Texts
(`PT-261:1`); `BD-{spell}:{line}` for the Book of the Dead;
`CT-{spell}:{line}` for the Coffin Texts; `BHC-{line}` for the
Book of the Heavenly Cow (Naville's line numbering).

## Source file format

All source files in `data-library/{book-slug}/source-{lang}-{N}.json`
follow this schema:

```json
{
  "schemaVersion": 2,
  "bookSlug": "<book slug>",
  "chapter": <number>,
  "source": {
    "type": "<masoretic-text | greek-critical | akkadian-transliteration | sumerian-etcsl | sumerian-composite | arabic-uthmanic | egyptian-hieroglyphic | ugaritic-alphabetic-cuneiform-best-effort-reconstruction | hittite-transliteration | avestan-transliteration | pahlavi-transcription | coptic-sahidic | persian-lithograph | arabic-lithograph | vietnamese-print | japanese-print | sanskrit-samhita | slavonic-edition | english-pd-edition | ...>",
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

`{lang}` in the verse object is the ISO 639-1 / -3 code:

| Code | Language |
|---|---|
| `he` | Hebrew |
| `grc` | Ancient Greek |
| `akk` | Akkadian |
| `sux` | Sumerian |
| `arb` / `ar` | Arabic |
| `egy` | Egyptian |
| `gez` | Ge'ez (Ethiopic) |
| `uga` | Ugaritic |
| `hit` | Hittite |
| `ave` | Avestan |
| `pal` | Pahlavi |
| `cop` | Coptic |
| `chu` | Old Church Slavonic |
| `fa` | Persian |
| `vi` | Vietnamese |
| `ja` | Japanese |
| `sa` | Sanskrit |
| `la` | Latin |
| `syc` | Syriac |

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
