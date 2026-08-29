+++
title = "Reader controls"
description = "Mobile floating action button (`reader-fab`), the Continue panel and its nav badge, and the scroll progress bar (`reading-progress`)."
template = "page.html"
weight = 20
+++

These Bifrost components compose the reader's control surface on long
content pages. They're documented together because they share a single
mental model: tools that help a reader navigate long content — and find
their way back into it — on a small screen.

## `.reader-fab`

Mobile-only floating action button that replaces the standalone
[`back-to-top`](../../chrome/back-to-top/) button on small screens.
Tapping the button expands a glassmorphic panel with reader-context
options: Contents, theme, font, bookmarks, top. Hidden above 1000px.

**Source:**
[`themes/bifrost/sass/components/_reader-fab.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_reader-fab.scss)

On book pages (`.library-book` is in scope) the FAB surfaces extra slots;
elsewhere it shows the generic set (theme + back-to-top). Visibility is
gated to pages with reading context — landing, overview, and index pages
get neither the FAB nor a back-to-top.

## `.bookmark-btn` / Continue panel

Inline bookmark button and the overlay card that gathers everything a
reader can pick back up: books and pages they're part-way through, audio
they're mid-way into, notes they've taken, and pages they saved for later.

It is **the search overlay, opened from the bookmark icon instead of the
magnifier** — not merely styled to match it. Same geometry, same glass,
same scrim, same page treatment, so a reader who has opened one already
knows how the other behaves:

| | Value |
|---|---|
| Position | `fixed`, `top: 5.5rem` (`4.5rem` <1000px, `4rem` <640px), centred with `margin-inline: auto` |
| Width | `90%` / `95%` / `98%` at the same breakpoints as `.search-modal` |
| Container | `background: transparent`, `border: 1px solid var(--color-border)`, `1rem` radius, `max-height: 70/75/80vh` |
| Shadow | `0 25px 50px` drop + `0 0 0 1px` outer ring + `inset 0 1px 0` top highlight |
| Glass | on `::before` — `--color-navbar-bg` + `blur(12px)` |
| Header | transparent + `blur(10px)`, `rgba(255,255,255,0.1)` rule, title + "Press Esc to close" + close |
| Scrim | `rgba(0,0,0,0.3)`, **unblurred** — the page blur is the shared `.search-modal-blur` layer at 4px |
| Page | root scroll locked, FABs hidden, navbar receded (desktop only) |

Three deliberate divergences from `.search-modal`, all of them corrections
rather than drift:

- **`max-width: 48rem`, not `80rem`.** Search runs to the navbar's full
  width because its results are a two-column grid of title plus body
  excerpt. These rows are single-column; 1280px of short titles reads as a
  mostly-empty table.
- **`z-index: 200`, not `60`.** The panel has to clear the FAB stack
  (`.to-top` and `.reader-fab` at 110/120, the glossary tooltip at 150).
  Those are hidden while it is open, but it must still out-rank anything
  that reappears mid-transition.
- **`visibility` is stepped, not eased.** See the gotcha below — this one
  is load-bearing for focus, and `.search-modal` still has the latent bug.

Note what the shared recipe costs, because it is easy to "fix" by accident:
**the panel does not slide.** Glass can live on a pseudo-element only while
nothing above it is transformed — WebKit drops backdrop-filter for any
element with a transformed ancestor. That is why `.search-modal` centres
itself with `margin-inline: auto` rather than `translateX(-50%)` and
animates opacity alone, and the panel now does the same. Reintroducing a
`transform: translateX()` here would silently kill the blur on iOS.

RTL needs nothing, and needs less than it used to: a centred card has no
edge to dock to, so the old direction-aware `justify-content: flex-end`
(and, before that, `--panel-closed-x` with its RTL sign-flip) is gone.
Only the tab strip mirrors, which it does on its own.

### Tabs

The panel holds three unrelated piles behind one icon, so it presents them
as three tabs rather than one long scroll:

| Tab | Contents | Rendered by |
|---|---|---|
| Reading | In-progress books and pages, then audio | `continue-reading.js` → `[data-continue-mount="reading"]` |
| Saved | Bookmarked pages, plus the Export / Import / Clear footer | `reading-list.js` |
| Notes | Verse-anchored notes across every book (up to 30) | `continue-reading.js` → `[data-continue-mount="notes"]` |

The strip is styled as `.search-filters`' **chip row**, not as an
underlined tab bar. The two overlays open from adjacent controls in the
same chrome; giving them two different "pick a subset" idioms would make
them look related but behave unrelated.

- Each pill carries a live count, and goes to `--empty` (dimmed, never
  removed) at zero — a tab that vanishes when its pile empties makes the
  strip jump under the pointer and hides the fact that the pile exists.
- The active pill fills from `--color-badge-bg` / `--color-badge-text`,
  **not** `--color-accent-primary`. The accent is a mid-tone in both
  themes and neither white nor the page background clears 4.5:1 on it; the
  badge pair is the theme's existing legible accent fill.
- Full WAI-ARIA tabs semantics: `role="tablist"` / `role="tab"` /
  `role="tabpanel"`, roving `tabindex`, arrows (mirrored under RTL) and
  Home/End. Opening moves focus onto the selected tab.
- `openPanel(tab)` takes an optional tab name, and the delegated toggle
  handler reads it off the button, so any entry point can deep-open:
  `data-toggle-reading-list="notes"`. The bare attribute every current
  call site uses means *pick for me* — `pickBestTab()` lands on the first
  tab that has something in it rather than on whichever was open last.
- Group headings survive only where a tab holds more than one list (the
  reading tab, when something is being read *and* something listened to).
  Elsewhere the pill above already names the pile.

### Gotcha: `transition: all` on anything inside an overlay

`visibility` is **inherited**, and the panel rests at
`visibility: hidden`. Two consequences bit in sequence, and both are
invisible until you try to move focus into the panel:

1. `transition: opacity .3s ease, visibility .3s ease` — what
   `.search-modal` still declares — keeps the panel computing as `hidden`
   for the whole fade-in. Nothing inside a hidden subtree can take focus,
   so `focus()` on open did nothing at all, silently. No number of `rAF`s
   fixes it; the property genuinely has not flipped yet. The fix is to
   step it: `visibility 0s linear .3s` at rest (delay the hide until the
   fade-out finishes) and `visibility 0s linear 0s` on `--open`.
2. With that fixed, the *tab buttons* stayed hidden anyway — because
   `transition: all` on `.reading-list-panel__tab` animated the inherited
   `visibility` change on the descendant. Enumerate transitioned
   properties inside an overlay; never use `all`.

Symptom to recognise: the overlay opens and looks right, but
`document.activeElement` is still `<body>`, and keyboard navigation inside
it does nothing until roughly one transition-duration later.

**Source:**
[`themes/bifrost/sass/components/_reading-list.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_reading-list.scss)

| Class                                | What                                                              |
|--------------------------------------|-------------------------------------------------------------------|
| `.bookmark-btn`                      | Inline button that toggles whether the current entry is saved.    |
| `.reading-list-panel`                | The panel itself; opened by any `[data-toggle-reading-list]` or `Shift+B`. |
| `.reading-list-panel__container`     | The glass card. (Was `__content` before it took the search overlay's geometry.) |
| `.reading-list-panel__tabs`          | The `role="tablist"` chip row.                                     |
| `.reading-list-panel__tab`           | One pill; `--active` fills it, `--empty` dims it.                  |
| `.reading-list-panel__tab-count`     | The live count inside a pill.                                      |
| `.reading-list-panel__tabpanel`      | One tab's contents; hidden via the `hidden` attribute.             |
| `.reading-list-panel__empty`         | A tab's own "nothing here" block — glyph, title, hint.             |
| `.reading-list-panel__group`         | One titled group, only where a tab holds more than one list.       |
| `.reading-list-panel__group-title`   | The group heading.                                                 |
| `.reading-list-panel__item`          | One row, hairline-separated — the `.search-result` idiom.          |
| `.reading-list-panel__section`       | Accent section chip ("Wiki", "Library · Ch. 6").                    |
| `.reading-list-panel__item-title`    | The title. Carries the weight; goes accent on hover.               |
| `.reading-list-panel__meta`          | "42% · 2 hours ago" — the quiet quantitative line.                 |

### Row anatomy

Every group renders the same three-part row — chip, title, meta — so the
panel reads as one list rather than three. Rows are borderless and
separated by a hairline, tinting on hover, exactly like `.search-result`;
cards with their own border and fill fought the glass behind them.

Two things that are easy to get wrong here:

- **`.reading-list-panel__list` is not unique.** Each group renders one.
  Any lookup for it must be scoped — `updatePanel()` once used a
  panel-wide `querySelector` and wrote the saved items into the *Continue*
  group's list, so with both kinds present the open items disappeared. The
  saved list now carries its own `[data-saved-list]` hook.
- **`__meta` uses `--color-text-muted`, not `--color-text-subtle`.** It
  deliberately diverges from `.search-result__url`, which uses the subtle
  token at reduced opacity — that is $gray-500 on the light theme, 2.1:1
  against the panel, and this line carries real information.

Quoted note passages use `<q>`, not hardcoded quotation marks: the element
supplies locale-correct marks on its own, which matters across ten
languages.

The chip carries its section's identity glyph ahead of the label, as a
`.section-mark--chip` sized in rem rather than the inherited `1em` — the
chip's font-size is 0.6875rem, and these are detailed Game-Icons marks that
turn to mush at 11px. It takes `currentColor` so glyph and label read as one
accent token, and the chip is a flex row: the marks have no baseline of
their own and sat visibly low against uppercase micro-type.

Runtime-built markup can't call the `section_icons::section` Tera macro, so
`scripts/section-icons.js` generates `static/js/section-icons.js`
(`window.WohSectionIcons.markup(slug)`) from `data/icons.json` plus
`templates/partials/icons/`, and `npm run bundle` regenerates it into
`core.bundle.js`. **It is deliberately a bundle module rather than a
per-page inline map** like `wiki-section.html`'s `WIKI_CATEGORY_ICONS`: the
five glyphs are ~10KB and are needed on every page, so the cached bundle
pays for them once instead of every request. When `data/icons.json` isn't
reachable — the standalone theme clone has no site root — the generator
keeps the committed copy rather than writing an empty map over it.

One asymmetry to know: continue/listening/notes rows carry a section
*slug*, but a saved row stores `section` as the section **title**, which is
translated and so can't key an icon map. `reading-list.js` derives the slug
from the row's URL instead, which also covers rows saved before glyphs
existed.

The panel is built client-side from `localStorage`. Two scripts share it:
`reading-list.js` owns the panel, the tab strip and the saved tab;
`continue-reading.js` fills the two mounts the strip exposes,
`[data-continue-mount="reading"]` and `[data-continue-mount="notes"]`.
Tab counts come from `ContinueReading.getReadingCount()` and
`getNotesCount()`, read defensively so the panel still works if that module
is absent. They stay in step through a `woh:reading-list-changed` document
event, so bundle order matters — `continue-reading.js` must load after
`reading-list.js`.

### What counts as an open item

`continue-reading.js` aggregates four writers, and reads every key
directly rather than through `LibraryStorage` — that module only ships in
`library.bundle.js` and is absent everywhere outside `/library/<book>/`.

| Key                    | Written by             | Covers                                  |
|------------------------|------------------------|-----------------------------------------|
| `woh_library_progress` | `library-storage.js`   | Position in a library book (chapter / paragraph). |
| `woh_page_progress`    | `page-progress.js`     | Scroll position in `/wiki/`, `/articles/`, `/timeline/`, `/news/` leaf pages. |
| `woh_listen_progress`  | `listen-button.js`     | Position in an audio session.           |
| `woh-reading-list`     | `reading-list.js`      | Pages saved for later.                  |

Notes (`woh_library_notes`) get their own tab but stay out of the badge
count — they are annotations on open items, not a separate pile of
unfinished business. The badge is `getOpenItemCount()`, which is
`getReadingCount()` plus the saved count.

Everything expires after 90 days, so a count can shrink on its own. Page
and audio records are keyed by the **locale-stripped path**, so the same
entry read in German and then English is one item; book slugs are shared
across locales already. Deep links are rebuilt with the current locale
prefix. The page you are looking at is excluded from its own count.

Records are dropped, not parked, at completion: a page past 90% of its
article element, or an audio session past 97%, stops being an open item.

### Gotcha: deferred bundles init in file order

`core.bundle.js` is deferred, so `document.readyState` is already past
`loading` when it runs. Every module in it therefore takes the
`else { init(); }` branch and initializes **synchronously, in bundle
order, during its own evaluation** — a later module's globals do not
exist yet.

This produced a real bug: `reading-list.js` decided the panel's empty
state from `window.ContinueReading?.getOpenItemCount()`, which was
`undefined` at that moment, so "Nothing open yet" rendered on top of a
populated panel. The fix is `ReadingList.refreshPanel`, which
`continue-reading.js` calls once it has initialized. Optional chaining
hides this class of failure rather than surfacing it, so any new
cross-module read at init time needs the same treatment.

## `.nav-badge`

Small encircled count pinned to the corner of a nav control, showing how
many open reading items exist (books, pages and audio in progress, plus
saved pages), capped at `9+` and hidden at zero. It has two hosts: the
burger toggle on mobile, and `.navbar__reading-btn` — the desktop
Continue-panel toggle that sits beside the search button — on desktop.

The desktop badge cannot live on the Read split-button CtA:
`.navbar__cta-split` sets `overflow: hidden`, which clips a corner badge,
and it is a `backdrop-filter` glass surface. `.navbar__reading-btn` reuses
the same `[data-toggle-reading-list]` hook as every other entry point, so
it needed no new JS — and it puts the panel one click from anywhere on
desktop instead of two.

**Source:**
[`themes/bifrost/sass/components/_nav-badge.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_nav-badge.scss)

| Class                 | What                                              |
|-----------------------|---------------------------------------------------|
| `.nav-badge`          | The badge; hidden until JS adds the modifier.     |
| `.nav-badge--visible` | Shown — set by `continue-reading.js` when count > 0. |

### Colours come from `--color-badge-bg` / `--color-badge-text`

Never style a count badge from the palette directly. The pair is defined in
all four theme branches (`themes/_init.scss` dark + light, `_dark.scss`,
`_light.scss`) and **inverts per theme**, because the badge has to clear two
different things at once: its own digit, and the chrome behind it.

| Theme | Fill         | Digit        | Contrast |
|-------|--------------|--------------|----------|
| Dark  | `$mint-300`  | `$mint-900`  | 7.7:1    |
| Light | `$mauve-700` | `$white`     | 6.8:1    |

The fills come from the **accent family** — the same mint and mauve as the
links, focus rings and section chips — so the count reads as part of the UI
rather than a warning pasted onto it.

The pair inverts per theme because the badge has to clear two things at
once: its own digit, and the chrome behind it. A pale fill pops against the
dark navbar but disappears into the light one. Both directions clear WCAG AA
for normal text — the badge is 12px, well under the 18.66px bold that would
let it qualify as large text at 3:1.

The badge also carries `box-shadow: 0 0 0 2px var(--color-background)`. It
sits on top of the icon it annotates, and without that ring the two shapes
merge into one blob; the ring is what makes it read as a distinct chip.

This replaced a static `c.$pink` fill with `color: white`. `$pink` resolves
to `$pink-300`, a pale peach, so that was **1.2:1 — illegible in both
themes**, and it was wrong in three places at once (`.nav-badge`, the
bookmark toggle badge, and the Read-dropdown badge, the last on
`--color-accent-primary` at 1.3:1 against dark-theme mint).

### Known contrast weaknesses elsewhere

Two related issues live in `_search-modal.scss` and are **not** fixed, since
correcting them changes the search overlay's own appearance:

- `.search-result__url` uses `--color-text-subtle` at `opacity: 0.7` —
  $gray-500 on the light theme, ~2.1:1.
- `.search-result__section` writes its tint and border as
  `rgba(var(--color-accent-primary), 0.1)`. The custom property holds a hex,
  so `rgba()` receives an invalid argument and the browser drops both
  declarations — the chip renders as bare accent text. The Continue panel's
  section chip deliberately matches how it *renders*, not what it declares.

Two constraints are load-bearing:

- **No transform.** The badge sits inside the navbar's `backdrop-filter`
  subtree, and WebKit drops the glass effect for any element with a
  transformed ancestor. Position with `top` / `right` only.
- **Critical-CSS gate.** The badge ships in the global chrome but is
  styled in `main.css`, so it needs an entry in the
  `html:not(.css-loaded)` block of `critical.scss` — without it the
  markup flashes as a stray "0" beside the burger icon before `main.css`
  arrives.

RTL flips the badge to the leading corner via `sass/layout/_rtl.scss`.

### Every count in the chrome is this one badge

`.nav-badge` is now the only count in the chrome. It renders in four places
— the burger toggle, the bookmark button inside the burger overlay, the
desktop `.navbar__reading-btn`, and **inline** in the Read dropdown's "Open
reading list" row — and all four read the same open-item total from
`continue-reading.js` via `[data-continue-badge]`.

Three placements are corner-pinned; the dropdown row takes
`.nav-badge--inline`, which drops the corner geometry (`position: static`,
`margin-inline-start`, no separation ring) and overrides `--visible` to
`inline-flex` at (0,2,0) so the chip joins the text flow. Inside the burger
overlay the badge is inset to `top/right: 4px`: its 44px `.navbar__bar-btn`
host is a bordered pill around a 22px glyph, so the button's own corner sits
too far from the mark it annotates.

The burger's badge hides while the menu is open
(`.navbar--mobile-expanded .navbar__mobile-toggle .nav-badge`). The overlay
carries the same count on the bookmark button inside it, and a count riding
a close X reads as "5 things to close".

**Retired:** `.reading-list-toggle__badge` and `reading-list.js`'s
`updateCounterBadge()`. That badge counted *saved bookmarks only*, and it
rendered next to two controls showing the open-item total — so the chrome
disagreed with itself about what "your reading" adds up to. The saved count
now reaches the shared badge through the `woh:reading-list-changed` event
that `saveReadingList()` dispatches. Its old copy went too: the dropdown
row's description named only the saved pile, so it was rewritten in all ten
locales to name both groups the panel shows.

The retired class had left two live bugs on record, worth keeping in mind
for any future badge: `_reading-list.scss` wrote it as `&__badge` nested
under `.reading-list-toggle`, which BEM-concatenates to a bare
*class* selector rather than a descendant one — so corner-pinning leaked
onto the inline instance — and `--visible` had to be repeated at the
dropdown's own specificity, a shortfall masked for as long as the JS wrote
an inline `style.display` (which beats any selector).

### The corner FABs render above the burger overlay

`.search-fab`, `.reader-fab` and `.to-top` are `position: fixed; z-index:
110` in the bottom-right — exactly where the expanded burger menu puts its
bar-controls row (theme, language, reading list). They stayed above the
overlay, so the reading-list button was fully occluded: `elementFromPoint`
at its badge returned `search-fab__icon`, the count painted underneath, and
a tap on the bookmark opened search.

`layout/_navbar.scss` hides the cluster for as long as the menu is up, from
inside the existing `html:has(body.mobile-nav-open)` block. **That host is
load-bearing, not incidental.** A plain `body.mobile-nav-open .reader-fab`
scores (0,2,1) — an exact tie with `body:has(.wiki__sidebar) .reader-fab` in
`components/_reader-fab.scss`, which wins on source order because components
load after layout. `html:has(body.mobile-nav-open)` scores (0,2,2) and
actually applies.

## `.continue-chip` / `.continue-module`

The two resume surfaces outside the panel, both rendered by
`continue-reading.js`.

**Source:**
[`themes/bifrost/sass/components/_continue.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_continue.scss)

| Class               | Where                                                        |
|---------------------|--------------------------------------------------------------|
| `.continue-chip`    | Landing hero §1 — one "pick up where you left off" link.     |
| `.continue-module`  | Top of `/read/` — up to six open items as cards.             |
| `.continue-bar`     | Shared progress hairline; width from `--continue-progress`.  |

Both mount into **empty** slots (`[data-continue-chip]`,
`[data-continue-module]`) that are `display: none` until JS finds
something to show, so a first-time reader's layout is byte-for-byte what
it was without them. The chip additionally waits for
`requestIdleCallback`, because the landing hero is the page's LCP.

### The chip is built from navbar material

`.continue-chip__link` used to carry its own palette — a
`rgba(0, 0, 0, 0.45)` fill, `blur(12px) saturate(160%)` on the element,
hardcoded white text, a 25%-white border. Every one of those is something
the chrome around it expresses as a token, and at `0.45` the fill was
roughly **four times as opaque as the navbar pill floating right above
it**. The navbar read as tinted air; the chip read as a black card dropped
onto the video. That gap, not the layout, was what made it feel foreign.

It is now the navbar's own recipe — `var(--color-navbar-bg)` plus
`blur(12px)` on a `::before`, a `--color-border` hairline, `--color-text` /
`--color-text-muted` for copy, and the navbar's `1rem` radius. Being the
same *mechanism* rather than a matched set of values is the point: the
chip also joined the over-hero token remap in `pages/_home.scss`, so it
flips with the rest of the chrome instead of hardcoding its own white.

The old opaque fill was defending against a WebKit backdrop-filter
drop-out — the original comment put it well: "the blur is an enhancement,
not the thing carrying contrast." That risk is real but is now covered
twice over, and centrally:

- `themes/_init.scss` swaps `--color-navbar-bg` for the near-opaque
  `--color-glass-bg` under `@supports not (backdrop-filter)`.
- The chip's ancestor chain (`.landing-section__inner` and up) is
  transform-free, which is the *other* half of why the navbar's glass
  survives every engine. Keep it that way — a transform anywhere above the
  chip silently kills the blur on iOS.

It also turned out the chip was **double-scrimmed**:
`.landing-section__overlay` already lays ~0.5 black over the video at the
chip's height, so the old `0.45` fill was stacking a second scrim on a
surface that was already dark. Measured on the rendered hero, the token
version clears WCAG AA on all three lines in both themes — tightest is the
light-theme label at 5.06:1.

Two things this component gets asked about:

- **Class names live only in JS strings**, so PurgeCSS cannot see them in
  any template. `scripts/purgecss.js` safelists `/^continue-/`.
- **`--continue-progress`, not an inline `width`.** A custom property
  keeps the bar restyleable (or disableable at a breakpoint) from the
  stylesheet.

Relative times ("2 hours ago", "yesterday") come from
`Intl.RelativeTimeFormat` against `document.documentElement.lang`, not
from translated strings — Intl already does this correctly in all ten
locales.

## `.reading-progress`

Thin gradient bar pinned to the top of every page (long-form templates
only), updating in real time as the reader scrolls. Driven by the inline
script in
[`templates/partials/reading-progress.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/partials/reading-progress.html).

**Source:**
[`themes/bifrost/sass/components/_reading-progress.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_reading-progress.scss)

3px tall, fixed top, `z-index: 200`. Gradient runs from
`--color-accent-primary` to `--color-accent-secondary` (falling back to
the primary). Faint glow via `box-shadow`. Hidden by default; JS adds
`--visible` after the reader scrolls a few percent.

The partial is included at the **top of `<body>`**, before `<main>`. Its
content-selector queries therefore have to wait for `DOMContentLoaded` —
running them inline matched nothing, and the `hasContent` guard hid the
bar on every page of the site.

It also emits `woh:reading-progress` on each rAF-throttled tick, with
`{ percent, contentPercent, content }`. `page-progress.js` persists off
that event rather than running a second scroll loop. The two numbers
differ on purpose: `percent` is document scroll (what the bar draws),
`contentPercent` is progress through the article element. The footer is
tall enough that a fully-read short entry never nears 100% of the
document, which would pin finished pages in the Continue panel forever.

## Live examples

- **Reader FAB** — open any wiki / article / library page on a phone-width viewport.
- **Continue panel** — scroll a little way into any
  [wiki entry](https://www.wheelofheaven.world/wiki/) or
  [library book](https://www.wheelofheaven.world/library/), bookmark an
  entry via the inline `.bookmark-btn`, then open the panel from the FAB,
  the navbar bookmark button, or `Shift+B`.
- **Nav badge** — once any of the above exists, the count appears on the
  burger toggle at phone width and on `.navbar__reading-btn` on desktop.
- **Continue chip / module** — with something open, the
  [landing hero](https://www.wheelofheaven.world/) grows a resume link and
  [/read/](https://www.wheelofheaven.world/read/) grows a card grid above
  the reading paths.
- **Reading progress** — visible on any long-form page, e.g.
  [/articles/](https://www.wheelofheaven.world/articles/) (top edge, scroll-driven).

## Related

- [`back-to-top`](../../chrome/back-to-top/) — desktop counterpart to the reader FAB.
- [`study-tools`](../study-tools/) — the in-book bookmark/highlight/note toolset that the reading list lists.
