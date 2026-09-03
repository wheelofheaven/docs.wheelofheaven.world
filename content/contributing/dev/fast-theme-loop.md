+++
title = "Fast Theme Loop"
description = "Why a one-line SCSS tweak used to cost a three-minute Zola build, and the four dev loops — dev, dev-lean, css, build — that bring it down to half a second."
template = "page.html"
weight = 22
+++

A full `zola build` of the reading site takes **189 seconds**. It renders
10,689 pages and writes 3.8 GB. That is the right cost for a deploy and
the wrong cost for adjusting a hover state.

This page covers the loops that avoid it, and — more usefully — the two
Zola behaviours that make the obvious shortcuts fail, so nobody has to
rediscover them.

> **Status:** shipped 2026-09 in the www repo. `mise run dev`,
> `dev-lean`, `css`, `build-dev`, `dev-config`. The production
> `serve` / `build` / `build-prod` tasks are unchanged.

## Why the loop was slow

Zola has **no incremental path for theme edits**. Any write under
`themes/` — SCSS or template, it makes no difference — logs:

```
Change detected @ 2026-09-03 09:18:04
-> Themes changed.
-> Creating 10689 pages (8000 orphan) and 120 sections
```

…and re-renders the entire site. Two things that look like they should
help, don't:

- **`zola serve --fast`** doesn't apply here. Measured on this corpus:
  19.0s with `--fast` versus 19.4s without, for the same SCSS edit.
- **Zola's sass-only fast path** exists, but only for a *root-level*
  `sass/` directory. Bifrost's SCSS lives at `themes/bifrost/sass/`,
  which Zola classifies as a theme change. Moving it to the site root
  would fix the loop and break the theme as a distributable.

So there is nothing to tune inside the rebuild. The only lever is
making the rebuild itself cheap.

## The lever: skip the translated locales

The reading site carries ten languages as *directories*
(`content/de/wiki/elohim.md`), not Zola's native `elohim.de.md` suffix.
The nine translated locales are:

- ~9,600 of the 10,689 pages — **90%**
- ~3.5 GB of the 3.8 GB output — **92%**

You almost never need the Korean library page while adjusting a card
shadow. Building English-only is a 10× cut on its own; dropping the
generated `/sources/` records as well makes it 19×.

## The four loops

| What you're changing | Command | Cost |
|---|---|---|
| SCSS only | `mise run css` | **0.5 s** |
| Templates, or you want real HTML | `mise run dev` | **19 s** |
| Same, and you're not touching `/sources/` pages | `mise run dev-lean` | **10 s** |
| Final check before push | `mise run build` | 189 s |

All of them take an explicit output directory or leave `public/` alone,
so they don't race a concurrent session's build.

### `mise run dev` — the default

English-only `zola serve` with live reload. 1,145 pages, 502 MB, ~19s
per rebuild. This is the one to reach for by default: it is the whole
English site, with every template exercised against real content, and
nothing about it is approximate.

### `mise run dev-lean` — when you want it faster

Same, minus the ~800 generated bibliography records under
`content/sources/_generated/`. Those are ~70% of the English page count
and near-identical to one another, so dropping them roughly halves the
rebuild again: 345 pages, ~10s.

Switch back to `dev` when you're working on `source-page.html` itself —
`dev-lean` leaves you nothing to look at.

### `mise run css` — the styling fast lane

The one that's actually instant. It skips Zola entirely:

1. Static-serves the last `public-dev/` build with
   `python3 -m http.server` (building it first, once, if missing).
2. Runs dart-sass in watch mode straight into that directory's
   `main.css`.

Save an SCSS file, and the served CSS updates in **0.46 s** measured
end-to-end. No Zola process is running, so there is no rebuild to churn
through on every keystroke.

**The caveat is narrow but real: HTML is frozen at the last build.**
The moment you touch a template, a shortcode, or content, switch to
`dev`. This mode only knows about CSS.

### `mise run build-dev` — a one-off sanity check

An English-only build into `public-dev/`, ~20s. Use it to confirm a
change renders across the whole English corpus without waiting three
minutes for the locales you didn't touch.

## What the dev configs actually change

`scripts/build_dev_config.py` derives `config.dev.toml` and
`config.lean.toml` from `config.toml` on every run, so they cannot
drift. Both are gitignored; every task that uses them `depends` on
`dev-config`, so they regenerate automatically.

Three differences from production:

| Setting | Why |
|---|---|
| `build_search_index = false` | A whole-corpus pass |
| `generate_feeds = false` | Same, per taxonomy and per language |
| `ignored_content` | Skips the pages under the nine locale directories |

The `[languages.*]` tables are **kept verbatim**. They generate no pages
of their own under directory-based locales, so they cost only TOML parse
time — and `404.html` builds a client-side i18n table by calling
`trans()` across every declared language. Strip them and the build fails
there.

The locale list is read from the `[languages.*]` headers rather than
hardcoded, so adding a tenth locale doesn't silently leave it in the dev
build.

## Two Zola traps

`ignored_content` is the obvious tool for this, and it has two edges
that aren't in the docs. Both cost real time to find. If the globs in
`build_dev_config.py` look like typos, this is why.

### 1. Globs match the *absolute* path

`ignored_content` patterns are matched against each file's full
filesystem path, not a path relative to `content/`. So:

```toml
ignored_content = ["de/**"]              # silently matches nothing
ignored_content = ["**/content/de/**"]   # works
```

The first form produces no error and no warning. It simply builds every
page you thought you'd excluded.

### 2. It filters pages, but not section `_index.md` files

This is the one that actually bites. Swallow a whole locale directory
and its **section root survives the glob**:

```
ERROR Failed to render section 'content/es/_index.md'
ERROR Reason: Language 'es' not found.
```

…or, if you keep the language tables so `trans()` resolves:

```
ERROR Reason: Section `ko/articles/_index.md` not found.
```

The orphaned section root renders, then dies looking for the pages you
just excluded. There is no flag for this.

The fix is a character class that spares every `_index.md`:

```toml
ignored_content = [
    "**/content/de/[!_]*.md",
    "**/content/de/**/[!_]*.md",
    # … one pair per locale
]
```

`[!_]` matches basenames that don't start with an underscore — so the
~9,600 locale *pages* are skipped while every section index stays
loaded. The locale sections still exist; they're simply empty. Nothing
downstream notices.

## A dead end, recorded

An alternative was built and abandoned: a second project root
(`zola --root .devroot`) assembled from symlinks, containing only the
English tree. It fails for two independent reasons, both fatal:

- **`load_data()` enforces containment.** It resolves its argument and
  rejects anything outside the project root, so `data/` and
  `themes/bifrost/` can't be symlinks — every `load_data` call in the
  theme blows up. Hard-linking those trees works around it, but only
  for files that don't change.
- **The file watcher doesn't follow symlinks.** Editing
  `themes/bifrost/sass/_card.scss` through a symlinked shadow root
  triggers no rebuild at all. This is the fatal one: it makes the
  entire approach pointless.

Zola *does* follow symlinks when walking `content/`, which is what made
the idea look viable. Don't retry it.

## Adding a locale

Nothing to do. The generator reads `[languages.*]` from `config.toml`,
so a new locale is excluded from the dev build the next time any dev
task runs.

## Related

- [Bifrost Theme](@/contributing/dev/bifrost-theme.md) — the theme
  itself: templates, SCSS architecture, the esbuild bundle
- [Local Setup](@/contributing/dev/local-setup.md) — getting the
  multi-repo environment running in the first place
- [Performance](@/architecture/performance.md) — the *site's* runtime
  performance, as opposed to build time
