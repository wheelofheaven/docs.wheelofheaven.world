+++
title = "Glossary tooltip"
description = "Hover/focus tooltip that shows wiki definitions inline over `.glossary-term` links inside article bodies."
template = "page.html"
weight = 10
+++

`.glossary-tooltip` is the floating panel that appears when a reader
hovers or keyboard-focuses a `.glossary-term` link — typically the dotted
underline wiki links rendered by the [`wiki` shortcode](../../shortcodes/wiki/).
The panel previews the linked wiki entry's summary so readers don't have
to leave the page to recall what a term means.

**Source:**
[`themes/bifrost/sass/components/_glossary-tooltip.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_glossary-tooltip.scss)
&middot;
[`themes/bifrost/templates/partials/glossary-tooltip.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/glossary-tooltip.html)

## Anatomy

| Class                        | What it does                                                  |
|------------------------------|---------------------------------------------------------------|
| `.glossary-term`             | The link itself: dotted underline (`text-decoration-style: dotted`) in `--color-accent-primary`, `cursor: help`. On hover the underline solidifies. |
| `.glossary-tooltip`          | The panel — `position: absolute`, 300px wide, fades in on `--visible`. |
| `.glossary-tooltip--below`   | Variant placed below the term when there's no room above (set by JS). |
| Arrow                        | CSS triangle pointing at the term; flips top/bottom with `--below`. |

JavaScript handles fetching the summary, positioning above/below based
on viewport room, and the visibility toggle. The panel content is
preloaded into the page at build time so it doesn't need a network round
trip.

## Live examples

Hover any dotted wiki link inside an article body, e.g. the wikilinks in
[/articles/](https://www.wheelofheaven.world/articles/).

## Related

- [Shortcodes → `wiki`](../../shortcodes/wiki/) — the shortcode that renders `.glossary-term` links.
