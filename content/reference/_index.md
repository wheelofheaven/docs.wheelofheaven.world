+++
title = "Reference"
description = "Look-up material — frontmatter fields, repository inventory, file formats, glossary, changelog."
sort_by = "weight"
weight = 40
template = "section.html"
+++

Reference pages are **flat catalogues**: lookup-oriented, not
narrative. Open them when you know what you're looking for and want
the canonical answer fast.

If you're trying to *understand* something rather than look it up,
you probably want [Architecture](@/architecture/_index.md) or one of
the [Contributing](@/contributing/_index.md) sections instead.

## What lives here

- **[Frontmatter Reference](@/reference/frontmatter.md)** — every TOML
  field that may appear in any content file. Universal fields,
  per-content-type fields, taxonomies, templates, four worked
  examples covering each content type.
- **[Library Book Format](@/reference/library-book-format.md)** — the
  JSON schema for books in `data-library`. Per-chapter format,
  paragraph refIds (`TBWTT-1:5`), i18n slots, speaker types.
- **[Repository Inventory](@/reference/repository-inventory.md)** —
  every repository in the `wheelofheaven` org. What it is, what's in
  it, the GitHub URL.
- **[Glossary](@/reference/glossary.md)** — project-internal terms
  (Bifrost, claim type, editorial pass, refId, OG card, etc.). Distinct
  from the on-site translations glossary in
  `data-content/i18n/glossary.json`.
- **[Changelog](@/reference/changelog.md)** — major project
  milestones (domain migration, editorial passes, infrastructure
  shifts) at a project level. Not commit history.

## How these stay current

Reference pages are kept in sync by hand. If you change something —
add a new frontmatter field, rename a repo, retire a content type —
update the relevant reference page in the same PR.
