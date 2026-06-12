+++
title = "Library Acquisition Program"
description = "How Wheel of Heaven decides which religious and mythological texts enter the Library: the original-language-first rule, Edition vs Translation tracks, the 20 traditions, and what a planned book looks like on disk."
weight = 45
+++

The Wheel of Heaven Library is being built to be authoritative on two
axes at once: **breadth** like the Internet Sacred Text Archive and
**scholarly depth** like Sefaria. This page documents the acquisition
program that decides which texts enter the corpus, in which form, and
in what order.

The companion pages:

- [Source-Text Translation](@/contributing/content/source-text-translation/_index.md)
  is the *production* side — how a chapter becomes a WoH Translation
  once it has been acquired.
- The
  [Translation Roadmap](@/contributing/content/source-text-translation/roadmap.md)
  is the *prioritisation* side — what's next in the queue.
- This page is the *strategic frame* — what's in the corpus and why.

## The strategic frame

Two principles, both load-bearing:

**Original language first.** The library acquires texts in their
**source language**, not as existing translations. Where no usable
public-domain English exists, the project translates the source
text in-house through the
[WoH Translation pipeline](@/contributing/content/source-text-translation/workflow.md).
This is the legal moat (a CC0 corpus cannot rest on copyrighted
critical editions) and the scholarly moat (for many texts, the WoH
translation will be the only freely-licensed modern English version
on the web).

**Read through the Raëlian-canon lens, presented at scholarly
register.** Comparative material is read with the Raëlian canon as
foundational. Other traditions, scientific context, and critical
scholarship are included, but they sit in dialogue with the canon,
not as alternatives competing for canonical status. The lens lives
in the apparatus — glossary entries, per-verse commentary — not in
the translated text itself. The discipline is recorded throughout
[Principles](@/contributing/content/source-text-translation/principles.md).

## Two tracks

| Track | What ships | When to use |
|---|---|---|
| **Edition track** | A public-domain edition hosted directly (ASV Bible, 1830 Book of Mormon, 1921 Pearl of Great Price, Tanzil Arabic Qur'an, Charles 1917 1 Enoch) | The text's original language is English, or a serviceable PD edition exists and translation effort is better spent elsewhere |
| **Translation track** (`-woh`) | `source-{lang}-{N}.json` (immutable PD or openly-licensed source) + fresh English translation + glossary + per-verse commentary via the three-agent pipeline | The WoH-lens leverage lives in lexical choices, or no usable PD English exists (the moat case) |

Every tradition entering the program starts with **an Edition-track
or small Translation-track pilot first**; full build-out is gated on
the pilot proving the pipeline handles the new language. The
two-track distinction is also reflected at the book level — the
`translationProgram: true` flag in `catalog.json` marks Translation
track books, conventionally suffixed `-woh` in their slug.

## Source-licence classes

A recurring clean pattern: the **digital portal** is unlicensed or
non-commercial, but the **print edition it was keyed from** is fully
public domain. When in doubt, key from the PD print scan and treat
the portal as a collation aid.

| Class | Examples | Posture |
|---|---|---|
| **PD** | Westminster Leningrad Codex (via Sefaria), Tregelles GNT, ETCSL, avesta.org / Geldner 1886–96, Naville 1886 (BoD), Sethe 1908–22 (Pyramid Texts), pre-1930 LDS editions | Ship freely; preferred |
| **CC BY-SA / CC BY** | ORACC, Thesaurus Linguae Aegyptiae (HuggingFace dumps), Perseus canonical-greekLit, First1KGreek, Coptic Scriptorium | Shippable with attribution; the BY-SA transliteration layer is labelled distinctly from the CC0 project text |
| **CC BY-NC** | eBL (electronic Babylonian Library), SEAL, Copenhagen Ugaritic Corpus | Working base for in-house translation; the resulting book may need to inherit the NC term — recorded in the book's `licensing` block. See [Library Book Format](@/reference/library-book-format.md) for the licensing inheritance pattern |
| **FREE (no licence)** | hethport.net Hittite editions, daotam.info (Caodai), reikaimonogatari.net (Oomoto), Bahá'í Reference Library | Usable as working base; ask permission before shipping the source layer; the PD print or lithograph behind it is the clean fallback |
| **BLOCKED** | DJD / Dead Sea Scrolls editions, CTH 789 Song of Release, machine-readable Greater Bundahishn | Deferred; tracked but not queued |

The `baal-cycle-woh` book's "best-effort reconstruction" provenance
model is the established precedent for cases where even the working
base is mixed: the source file's `source.versionTitle` declares
"reconstruction from named scholarly editions", and every reference
edition consulted is cited verbatim in `source.citation`.

## The 20 traditions

`data-library/catalog.json` defines twenty traditions, each with
zero or more collections. The boundaries are deliberately broad
(e.g. "Levantine" covers the Ugaritic corpus and West-Semitic
material in Hittite preservation) and the IDs are stable. New
collections are added under an existing tradition before a new
tradition is added.

| Tradition ID | Name | Representative books |
|---|---|---|
| `raelian` | Raëlian Corpus | The Book Which Tells the Truth, Extraterrestrials Took Me to Their Planet, Let's Welcome the Extraterrestrials |
| `hebrew-bible` | Hebrew Bible | Tanakh (Edition + 6 WoH books in flight) |
| `christian` | Christian Texts | New Testament (Edition + 5 WoH books in flight); Gnostic / Nag Hammadi planned |
| `judaic` | Jewish Texts (Second Temple, Rabbinic) | Genesis Apocryphon, Book of Giants (both BLOCKED) |
| `apocrypha` | Apocrypha & Pseudepigrapha | 1 Enoch, Jubilees; 2 Enoch, Ascension of Isaiah, Sibylline Oracles, Life of Adam and Eve planned |
| `islamic` | Islamic Texts | Qur'an (Edition + WoH selections) |
| `mesopotamian` | Mesopotamian Texts | Six WoH books shipped; the Atrahasis ring and the King List planned |
| `mormon` | Latter-day Saint Texts | Book of Mormon (1830 Edition), Pearl of Great Price (Book of Abraham, Moses, JS—History), D&C selections |
| `western_esoteric` | Western Esoteric | Corpus Hermeticum; Poimandres planned |
| `egyptian` | Egyptian Texts | Papyrus of Ani; Heavenly Cow, Memphite Theology, Pyramid Texts planned |
| `vedic` | Vedic & Indic | Rig Veda Book X; selections from RV 1, 10 + Śatapatha flood planned |
| `levantine` | Levantine Texts | Baal Cycle (KTU 1.3–1.4 shipped); rest of the cycle, Aqhat, Rephaim, Kirta planned |
| `kabbalah` | Kabbalah & Hekhalot | Shi'ur Qomah; 3 Enoch, Sefer Yetzirah planned |
| `ancient-astronaut` | Ancient Astronaut Literature | Reference shelf |
| `bahai` | Bahá'í Writings | Hidden Words, Tablet of the Universe, Kitáb-i-Íqán, Some Answered Questions planned (Persian / Arabic) |
| `caodai` | Caodaist Canon | Thánh Ngôn Hiệp Tuyển, Pháp Chánh Truyền, Tân Luật planned (Vietnamese) |
| `oomoto` | Oomoto Scriptures | Oomoto Shin'yu, Reikai Monogatari planned (Japanese) |
| `anatolian` | Hittite & Hurrian Texts | Kumarbi cycle, Illuyanka, Telipinu planned (Hittite) |
| `persian` | Persian & Zoroastrian Texts | Vidēvdād, Gathas, Zamyad Yasht, Bundahishn planned (Avestan / Pahlavi) |
| `greek` | Greek Texts | Theogony, Plato, Berossus, Philo of Byblos planned (classical Greek) |

For the canonical list with full multilingual names and
descriptions, read `catalog.json.traditions` directly.

## The acquisition catalogue

Every text the project intends to acquire is recorded in
`catalog.json` with `status: "planned"` and a populated
`versionSource` field that names the specific open-licensed source
edition the translation will be built from. Two examples:

```json
{
  "slug": "vendidad-woh",
  "code": "VID-WOH",
  "tradition": "persian",
  "collection": "woh-translations",
  "originalLang": "ave",
  "primaryLang": "ave",
  "status": "planned",
  "priority": 5,
  "versionSource": "Geldner, Avesta: the Sacred Books of the Parsis, vol. 3 (1886-96, PD); avesta.org as collation aid; Darmesteter SBE 4 (1880, PD) as reference",
  "translationNote": "Planned Wheel of Heaven Translation from the Avestan. Initial scope: Fargard 2 — Ahura Mazda warns Yima of catastrophic winters and commands the vara, an enclosed refuge stocked with the seed of every species; the strongest engineered-survival narrative outside the flood cluster.",
  "wohCurated": true,
  "translationProgram": true
}
```

```json
{
  "slug": "book-of-abraham",
  "code": "ABR",
  "tradition": "mormon",
  "collection": "lds-restoration",
  "originalLang": "en",
  "primaryLang": "en",
  "status": "planned",
  "priority": 5,
  "versionSource": "Pearl of Great Price, pre-1930 PD editions (1851 Liverpool; 1921), via Wikisource/archive.org",
  "translationNote": "Edition track: PD pre-1930 text hosted directly...",
  "versionLicense": "Public Domain"
}
```

`priority` is a coarse integer ordering (5 = pilot wave / cluster
completion, 6 = build-out, 7 = long tail). `status` flips from
`planned → partial → complete` automatically as chapters ship — see
[Library Book](@/contributing/content/library-book.md#catalog-validation).

The exhaustive per-tradition source assessments — which open edition
to key from, which print is PD, which reference translation is
acceptable — are at
[Source acquisition](@/contributing/content/source-text-translation/source-acquisition.md).

## Sensitivity carve-outs

Some living traditions are entered with conservative posture, stated
in the relevant book's methodology note:

- **Qur'an** — divine names (Allāh, ar-Raḥmān, ar-Raḥīm) and the
  Throne (al-`Arsh) held in transliteration with carve-outs;
  consult Muslim scholarship before shipping speculative readings.
- **Bahá'í** — divine titles held in transliteration on first pass;
  WoH translations stated as unofficial and independent of the
  authorised Bahá'í World Centre renderings; transcribe from PD
  lithographs (H-Bahai, INBA facsimiles via Afnan Library) rather
  than copying the BWC e-texts, sidestepping edition-copyright
  claims.
- **LDS** — Edition track only (no source-language layer exists);
  pre-1930 edition explicitly named; the Book of Abraham's relation
  to the Joseph Smith Papyri is an active controversy, hosted in
  wiki/commentary with `critical` sourcing, not in the edition
  itself.
- **Caodai, Oomoto** — small traditions with living hierarchies;
  courtesy contact with the source-text archives
  (daotam.info, reikaimonogatari.net, Oomoto Foundation) accompanies
  any licence-status questions.

## What this is not

This is an acquisition catalogue, not a delivery schedule. Reviewer
bandwidth remains the binding constraint. The 72 planned books in
`catalog.json` represent verified sourcing — every entry has a real
open-licensed source edition identified — but the rate at which they
move from `planned` to `partial` to `complete` is set by the
[roadmap](@/contributing/content/source-text-translation/roadmap.md),
not by their presence in this catalogue.
