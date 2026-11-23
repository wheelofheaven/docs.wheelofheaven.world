+++
title = "Phone menu"
description = "The burger menu on phones: the Start-here item, item icons, two-column groups, and the two-pane layout behind the language picker."
template = "page.html"
weight = 96
+++

On phones the navbar opens into a full menu.
It is the same markup as the desktop bar
(`themes/bifrost/templates/partials/navbar.html`), restyled inside
`.navbar--mobile-expanded` in `sass/layout/_navbar.scss`.

## Start here

The first item, `.navbar__menu-start`, links to the Start page from every
page, so a newcomer always has one obvious way in.
It reuses the `startHereLink` string and is hidden on desktop.

It is the only item that wears the accent: a translucent rainbow wash that
drifts across it once every 16 seconds, inside a ring of the same band at
full strength.
The ring is the same eight stops as the wash, tiled (`background-size:
200% 100%`) and animated with the same keyframes (`navbar-start-drift`), so
at every point the border is the fill's own hue.
Keep the two in step if you change either: same stops, same size, same
duration.
`prefers-reduced-motion` holds both still.

## Search

Under Start here sits a search row, `.navbar__menu-search`.
It carries `data-search-toggle`, the hook the floating search button and
the desktop search icon already use, so it needs no script of its own;
`navbar-mobile-toggle.js` only closes the menu first.

## You are here

The accent is the text ink, so an active item that merely changed colour
would look like every other item.
On phones the current item and the group that holds it
(`.navbar__link--active`, `.navbar__menu-read--active`,
`.navbar__dropdown-trigger--active`,
`.navbar__dropdown-inline-link--active`) carry a short rainbow dash at the
start of the row and a 700 weight.
On the desktop bar the current section wears the rainbow as an underline.

The sub-links get their active class in the template from `nav_path`:
each link's `class` attribute appends
`navbar__dropdown-inline-link--active` (and the link gets
`aria-current="true"`) when `nav_path` starts with that link's path.
When you add a sub-link, give it the same condition.

## Item icons

Every item and sub-item carries a `.navbar__item-icon` in front of its
label.
The icons are the ones the desktop dropdowns already use, so a section
looks the same in both places.
They are `display: none` by default and shown only inside
`.navbar--mobile-expanded`; the desktop bar stays text.

To add an item, put the span first inside the link:

```html
<a href="…" class="navbar__dropdown-inline-link">
    <span class="navbar__item-icon" aria-hidden="true">{%/* include "partials/icons/game-lyre.html" */%}</span>
    Listen
</a>
```

Use the section's registered icon where it has one (see the
[icon registry](../../../reference/icons/)).
In a group header the icon goes before the label span, and the caret keeps
the far edge with `margin-inline-start: auto`.

## Groups

**Knowledge** holds ten links in four titled groups, two to a row:
Explore (Map, Graph, Topics), Texts (Timeline, Library, Wiki), Reference
(Sources, Datasets) and Media (Gallery, Listen).
The phone list is `.navbar__dropdown-inline--grouped`, a two-column grid
of `.navbar__dropdown-group`; the desktop panel uses
`.navbar-dropdown__links--grouped` with `.navbar-dropdown__group`.
The titles are the `navbarGroupExplore`, `navbarGroupTexts`,
`navbarGroupReference` and `navbarGroupMedia` strings in the site's
`config.toml`, present in every language: `trans()` fails the build on a
missing key, so add a new group's title to all ten tables.

**Community** is ungrouped: its links flow in two columns, filled top to
bottom (`column-count: 2`).
That list must be `display: block`, because a flex container ignores
`column-count`.

Sub-items use a smaller icon and tighter padding so a long label such as
"Code of Conduct" still fits half the width; it may wrap to two lines.

## Two panes

The menu is two panes side by side: the main list and the language
picker.
`.navbar__content--lang-open` slides the pair by half its width.

The scroll box is wider than a pane by its own side padding, so a pane
that is merely slid away still shows a sliver at the edge.
The pane that is not showing is therefore `visibility: hidden`, with a
0.3s delay so the slide finishes first.
That also takes its controls out of the tab order.
Do not replace it with `overflow: hidden` on the panes wrapper: the main
pane needs to scroll.

## Descriptions

Read, Articles and Newsroom carry one quiet line under the label
(`.navbar__item-desc` inside `.navbar__item-text`), shown only in the
phone menu.
Articles and Newsroom use their existing `navbarArticlesDesc` and
`navbarNewsDesc` strings; Read joins the three section names it leads to
(`navbarReadBook`, `navbarReadWiki`, `navbarReadSources`), so no string
had to be added.
