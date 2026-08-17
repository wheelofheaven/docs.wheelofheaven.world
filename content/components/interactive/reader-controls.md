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

Inline bookmark button and the slide-in panel that gathers everything a
reader can pick back up: books and pages they're part-way through, audio
they're mid-way into, notes they've taken, and pages they saved for later.

The panel is built to **the same recipe as `.search-modal`**, so the two
overlays read as one family:

| | Value |
|---|---|
| Container | `background: transparent`, `border: 1px solid var(--color-border)`, `1rem` radius |
| Shadow | `0 25px 50px` drop + `0 0 0 1px` outer ring + `inset 0 1px 0` top highlight |
| Glass | on `::before` — `--color-navbar-bg` + `blur(12px)` |
| Header | transparent + `blur(10px)`, `rgba(255,255,255,0.1)` rule |
| Scrim | `rgba(0,0,0,0.3)`, **unblurred** — keeps the page behind it sharp |

Note what that costs, because it is easy to "fix" by accident: **the panel
does not slide.** Glass can live on a pseudo-element only while nothing
above it is transformed — WebKit drops backdrop-filter for any element with
a transformed ancestor. That is why `.search-modal` centres itself with
`margin-inline: auto` rather than `translateX(-50%)` and animates opacity
alone, and the panel now does the same. Reintroducing a
`transform: translateX()` here would silently kill the blur on iOS. The
upside is that `--panel-closed-x`, its RTL sign-flip and a defensive
overflow clip all stopped being necessary; only `--panel-inset` remains.

RTL needs nothing: `justify-content: flex-end` is direction-aware, so the
card docks to the correct edge on its own.

**Source:**
[`themes/bifrost/sass/components/_reading-list.scss`](https://github.com/wheelofheaven/bifrost/blob/main/sass/components/_reading-list.scss)

| Class                                | What                                                              |
|--------------------------------------|-------------------------------------------------------------------|
| `.bookmark-btn`                      | Inline button that toggles whether the current entry is saved.    |
| `.reading-list-panel`                | The panel itself; opened by any `[data-toggle-reading-list]` or `Shift+B`. |
| `.reading-list-panel__group`         | One titled group — continue reading, continue listening, recent notes, saved for later. |
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
  Any lookup for it must be scoped to its group — `updatePanel()` used a
  panel-wide `querySelector` and wrote the saved items into the *Continue*
  group's list, so with both kinds present the open items disappeared.
- **`__meta` uses `--color-text-muted`, not `--color-text-subtle`.** It
  deliberately diverges from `.search-result__url`, which uses the subtle
  token at reduced opacity — that is $gray-500 on the light theme, 2.1:1
  against the panel, and this line carries real information.

Quoted note passages use `<q>`, not hardcoded quotation marks: the element
supplies locale-correct marks on its own, which matters across ten
languages.

The panel is built client-side from `localStorage`. Two scripts share it:
`reading-list.js` owns the panel and the saved-for-later group, and
`continue-reading.js` renders the in-progress, listening and notes groups
into the `[data-continue-mount]` slot. They stay in step through a
`woh:reading-list-changed` document event, so bundle order matters —
`continue-reading.js` must load after `reading-list.js`.

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

Notes (`woh_library_notes`) render as their own group but stay out of the
badge count — they are annotations on open items, not a separate pile of
unfinished business.

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

The distinction from the bookmark-adjacent badge
(`.reading-list-toggle__badge`) is deliberate: that one still counts only
saved pages, because it sits next to bookmark-specific labels.

### `.reading-list-toggle__badge` renders in two contexts

It appears both pinned to the navbar bookmark button and **inline** inside
the Read dropdown's "Open reading list" row. `_reading-list.scss` writes it
as `&__badge` nested under `.reading-list-toggle`, which BEM-concatenates to
a bare `.reading-list-toggle__badge` — a *class* selector, not a descendant
one — so its corner-pinning rules apply to the inline instance too. The
dropdown block in `layout/_navbar-dropdown.scss` therefore has to explicitly
reset `position: static` and repeat `&--visible` at its own (0,3,0)
specificity.

Both were live bugs. The inline badge was being absolutely positioned out of
its row, and it stopped appearing entirely the moment `reading-list.js`
moved from an inline `style.display` to a modifier class — an inline style
beats any selector, so the specificity shortfall had been masked. If you add
a third rendering context, reset `position` and re-declare `--visible` there
too.

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
