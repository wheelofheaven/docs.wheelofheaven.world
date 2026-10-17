+++
title = "Footer Social Icons"
description = "The footer's social-icon row and Social Media column, and how to add a new platform — the partials/social pattern, the include, and the optional brand-color hover."
template = "page.html"
weight = 90
+++

The site footer uses one **`footer__socials`** row of labeled monochrome icons.
The duplicate Social Media text column was removed in October 2026.
The row lives in `themes/bifrost/templates/partials/footer.html`; each icon
has a partial under `partials/social/`.

## Footer hierarchy

The default view contains a short localized introduction, Start reading, and
Get started. The wordmark links home. Two link columns remain side by side
on phones; the introduction sits above them.

A native **More links** disclosure holds secondary sections, press assets,
community, development, and privacy links. It works without JavaScript and
keeps those destinations available to keyboard users and crawlers.
Social links, the license, and desktop language/theme controls remain visible.
The decorative rainbow is 4rem tall.

The concise introduction uses `footerSummary` in all ten site languages;
`elevatorPitch` remains available for longer editorial contexts.

The RSS link uses `/rss.xml` in English and the localized
`/articles/rss.xml` in translated editions. Avoid language-root feeds:
they were absent in production and empty in a newer local build.
See [feed discovery](@/architecture/indexing.md#feed-discovery-and-legacy-feed-urls).

## Adding a platform

1. **Icon partial** — create `partials/social/<name>.html`: an
   `<a class="footer__social-link">` (add a `footer__social-link--<name>`
   modifier if you want a brand hover) wrapping a **24×24** SVG with
   `fill="currentColor"` (or `stroke="currentColor"`), plus `href`,
   `target="_blank" rel="noopener"`, and an `aria-label`. Keep it monochrome so
   it inherits the footer text colour and inverts cleanly in dark mode.
2. **Include it** in the `footer__socials` row in `footer.html`.
3. **Brand hover** (optional) — in `sass/layout/_footer.scss`, under
   `&__social-link`, add `&--<name>:hover { color: <brand>; }`. Because the SVG
   is `fill="currentColor"`, tinting the link colour tints the mark.

## Example: Hugging Face

`partials/social/huggingface.html` uses the simple-icons mark
(`fill="currentColor"`), links to
[huggingface.co/wheelofheaven](https://huggingface.co/wheelofheaven), sits in the
socials row after GitHub, and its `--huggingface:hover` rule tints the mark
Hugging Face yellow (`#ffd21e`) on hover.

**Which icons get a colour.** Only platforms with a real brand colour carry a
hover tint — Telegram (blue), YouTube (red), Open Collective (blue), Hugging Face
(yellow). **X and GitHub stay monochrome**: they're black-and-white brands, so a
brand-colour hover would be arbitrary; they keep only the background + lift.
