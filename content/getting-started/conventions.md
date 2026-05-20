+++
title = "Conventions"
description = "File names, branches, commits, code style — the small set of conventions everything else follows from."
weight = 30
+++

The Wheel of Heaven project is small enough to live on conventions rather
than enforcement. This page is the short list — read it once before your
first PR and you'll fit in.

For language- or section-specific rules (how to write a wiki entry, how
to write an Article, etc.), see the
[Contributing → Content](@/contributing/content/overview.md) pages.

## Git

### Commit messages

- Imperative mood: `Add elohim wiki entry`, not `Added` or `Adding`
- First line under 72 characters
- Reference issues when applicable: `Fix #123`
- Optional conventional prefixes when they add signal:
    - `feat:` — new feature
    - `fix:` — bug fix
    - `docs:` — documentation only
    - `refactor:` — code change that neither fixes a bug nor adds a feature
    - `test:` — adding or updating tests
    - `chore:` — maintenance (deps, tooling, etc.)

Body (optional, after a blank line) explains *why*. Use it when the
diff doesn't make the motivation obvious.

### Branches

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Always deployable. |
| `feature/{short-name}` | New feature work |
| `fix/{short-name}` | Bug fixes |

Anything in `main` deploys automatically. If it can't, it doesn't belong
on `main`.

### Identity

All wheelofheaven commits use:

- **GitHub user:** `zarazinsfuss`
- **Email:** `zarazinsfuss@users.noreply.github.com`

### Submodules

Submodules use SSH URLs except when CI needs to clone them — then HTTPS:

```ini
# .gitmodules
[submodule "themes/bifrost"]
    path = themes/bifrost
    url = https://github.com/wheelofheaven/bifrost.git   # HTTPS for CF Pages
```

When you update a submodule, commit the pointer change in the parent repo
with a message like `Update content submodule`.

## File names

| Kind | Convention | Examples |
|---|---|---|
| Markdown content | `kebab-case.md` | `age-of-aquarius.md` |
| SCSS partials | `_kebab-case.scss` | `_navbar.scss` |
| Tera templates | `kebab-case.html` | `wiki-page.html` |
| Section partials | `{name}-section.html` | `wiki-section.html` |
| Page partials | `{name}-page.html` | `wiki-page.html` |
| JS modules | `kebab-case.js` | `library-reader.js` |
| Python scripts | `snake_case.py` | `process_images.py` |

Match the slug to the file name to the URL — a wiki entry titled "Age of
Aquarius" lives at `wiki/age-of-aquarius.md` and serves at
`/wiki/age-of-aquarius/`.

## Code style

### Indentation

| File type | Indent |
|---|---|
| YAML, JSON | 2 spaces |
| HTML, Tera templates | 4 spaces |
| SCSS | 2 spaces |
| Python | 4 spaces |
| Markdown | 4 spaces in lists (continuation), or per-list-style |

### Naming inside code

- **CSS/SCSS classes:** BEM — `.block__element--modifier`
- **SCSS variables:** `$kebab-case`
- **Python:** `snake_case`
- **JavaScript:** `camelCase`

### Comments

The bar is *non-obvious*. Don't comment what the code clearly does. Do
comment *why* — a hidden constraint, a workaround for a specific bug, an
invariant a reader couldn't infer.

### Don't leave commented-out code

If you're not using it, delete it. Git remembers.

## Markdown content style

### Frontmatter

TOML, always. Delimited with `+++` (not `---`).

```toml
+++
title = "Page Title"
description = "150–160 char SEO description"
template = "wiki-page.html"

[extra]
claim_type = "direct"
+++
```

See the [Frontmatter Reference](@/reference/frontmatter.md) for every
field.

### Headings

- One H1 per page — *don't* put it in the body; the template uses
  `title` from frontmatter
- Body headings start at `##` (H2)
- Maintain hierarchy (don't skip from `##` to `####`)

### Internal links

Use Zola's `@/` syntax for internal links between markdown files:

```markdown
See [Elohim](@/wiki/elohim.md) for the canonical definition.
```

Zola checks these at build time — broken `@/` links fail the build.

For links to live URLs (not markdown), use absolute paths:

```markdown
[Browse the wiki](https://www.wheelofheaven.world/wiki/)
```

### One sentence per line

Optional, but recommended for prose in long markdown files. Easier diffs;
diff tools can highlight word-level changes without false reflows.

## Pull requests

- One topical change per PR. If your branch needs two commit messages to
  describe, it should probably be two PRs.
- PR title = imperative summary (same rule as commit messages).
- PR body explains *why* and includes a test plan checklist for non-trivial
  changes.

## CI / CD

- Builds run on push to `main` and on PRs.
- Use specific action versions in workflows, not `@latest`.
- Never commit secrets. Use GitHub Secrets for sensitive values; document
  required secrets in the repo's README.

## Accessibility

- All images need alt text. Decorative images get `alt=""` (an empty
  string is meaningful).
- Maintain heading hierarchy (H1 → H2 → H3).
- Color contrast — use the Bifrost palette, which is already tuned for
  WCAG AA.
- Keyboard nav must work everywhere. Test before shipping.

## Performance

- Optimize images via the [Image pipeline](@/contributing/dev/pipelines.md);
  never commit unprocessed images larger than a few hundred KB.
- Minimize JavaScript. The site loads its critical CSS inline; new JS
  must justify its bytes.
- Lazy-load below-the-fold images (the `figure` shortcode does this
  automatically).
- Target sub-3-second page load on a cold mobile connection.

## When in doubt

Read three existing files of the same kind. The conventions on this page
are a summary; the actual codebase is the source of truth.
