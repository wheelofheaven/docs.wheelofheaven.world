+++
title = "Reading aids: route, interlinear, rows, compare"
description = "Four small figures a guided page sets between its paragraphs: a timed table of contents, a passage word by word, labelled statements on hairlines, and two readings side by side."
template = "page.html"
weight = 16
+++

The reading aids are four shortcodes for pages that walk a newcomer through
an argument, such as [Start Here](https://www.wheelofheaven.world/start/).
Each one shows the shape of a step before the prose explains it.
They use the reading grammar's hairlines, the eyebrow voice and the
[rainbow accent](../../tokens/colors/#theme-accents); none of them is a card.

**Source:**
[`templates/shortcodes/route.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/route.html)
· [`interlinear.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/interlinear.html)
· [`rows.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/rows.html)
· [`compare.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/compare.html)
· [`sass/components/_reading-aids.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_reading-aids.scss)

## The shared body format

All four take a body with **one item per line** and **columns separated by
`|`**.
Three rules follow from how Zola handles shortcodes:

1. **No nesting.** A shortcode body cannot contain another shortcode, so
   `wiki`, `libref` and `claim` do not work inside a row. Write a plain
   markdown link instead; cells are rendered as inline markdown.
2. **No `|` inside a cell** and no blank line inside a body.
3. **No straight double quote inside an argument value** (`left="…"`,
   `caption="…"`); use typographic quotation marks.

Translated pages pass their own strings; nothing here is read from
`config.toml`.

## route

A timed table of contents: a bar divided in proportion to each step's
length, then the steps as numbered jump links.

```markdown
{%/* route(label="Ten minutes, five steps", unit="min") */%}
premise | The premise, and who is making it | 1
labels | How to tell a source from an interpretation | 2
verse | One verse, read closely | 3
{%/* end */%}
```

| Argument | Required | |
|---|---|---|
| `label` | yes | accessible name of the navigation |
| `unit` | no | short unit printed after each number, such as `min` |

Each line is `anchor | title | units`, with units from 1 to 6.
The anchor is a heading id on the same page.
Give the headings explicit ids (`## 1. The premise {#premise}`) and reuse
the same ids in every language, so the translated pages need no anchors of
their own.

## interlinear

A short passage word by word: the original script, a transliteration, a
gloss and a grammatical note under each word.

```markdown
{%/* interlinear(lang="he", dir="rtl", caption="Genesis 1:26, opening words.") */%}
וַיֹּאמֶר | vayyomer | and said | verb, singular
אֱלֹהִים | Elohim | Elohim | noun, plural in form | *
{%/* end */%}
```

| Argument | Required | |
|---|---|---|
| `lang` | yes | BCP 47 code of the original script |
| `dir` | no | `rtl` lays the words out right to left (default `ltr`) |
| `caption` | no | a line under the strip, inline markdown |

Each line is `original | transliteration | gloss | note | *`.
The trailing `*` marks the words the surrounding prose is about; they take
the rainbow rule and a darker note.
Mark only what the argument rests on, and label the unmarked words as
honestly as the marked ones: on Start Here the strip shows that the verb
"said" is singular, which is the fact the counter-argument uses.

## rows

Labelled statements on hairlines: facts at a glance, a set of
alternatives, or a list of ways onward.

```markdown
{%/* rows() */%}
A council | God addressing attendant beings. | Most scholars today
Plural makers | More than one maker. | !Wheel of Heaven
{%/* end */%}

{%/* rows() */%}
Follow the story | The [timeline](/timeline/) tells it in twelve chapters. | | timeline
{%/* end */%}

{%/* rows() */%}
claim:direct | Stated in a primary source and uncontroversial.
{%/* end */%}
```

Each line is `label | text | tag | icon`; only the first two are required.

| Column | |
|---|---|
| `label` | short lead in the display face. `claim:direct` (or `framework`, `inferred`, `speculative`) prints that [claim badge](../../chrome/claim-badge/) instead, in the page's language |
| `text` | the statement, inline markdown |
| `tag` | a small pill after the text. A leading `!` sets it on the rainbow ring: use it for the project's own position, once per list |
| `icon` | a [section mark](../../chrome/section-mark/): `timeline`, `wiki`, `library`, `articles`, `map`, `news`, `sources`, `datasets` |

On phones the label sits above the text; from 768px they share a row.

## compare

Two readings of the same evidence side by side, question by question.

```markdown
{%/* compare(left="The council reading", right="The plural-makers reading", shared="Both take the plural seriously.") */%}
Who says "us"? | One God, to a council | The makers, to one another
Held by | Most biblical scholars today | The Raëlian Messages and Wheel of Heaven
{%/* end */%}
```

| Argument | Required | |
|---|---|---|
| `left`, `right` | yes | the two column heads |
| `accent` | no | `left` or `right`: which column is the page's own reading (default `right`) |
| `shared` | no | a closing line across both columns |

Each line is `question | left answer | right answer`.
Give both columns the same care.
The component is for showing where two readings part, so state the other
reading as its holders would.

## When to use them

Use the aids on guided, newcomer-facing pages where a reader needs the
outline quickly.
Wiki entries and articles argue in prose and should stay prose; a `rows`
block there usually means a paragraph was not written.
