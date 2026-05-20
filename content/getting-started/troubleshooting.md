+++
title = "Troubleshooting"
description = "Common errors when getting set up locally — submodules, mise, port collisions, Zola, CF Pages — and how to unstick each."
weight = 25
+++

If [Quickstart](@/getting-started/quickstart.md) didn't go smoothly,
this page collects the failure modes that come up most. Each entry is
short on purpose — the symptom, the cause, the fix.

## Submodules

### "Template not found" / "Content not found" on first build

You cloned without `--recurse-submodules`. The site fails because
`themes/bifrost/` or `content/` is an empty directory.

```sh
git submodule update --init --recursive
```

Then re-run the build.

### Submodule pointer is "dirty" after commit

```
$ git diff content
Subproject commit abc123...-dirty
```

The submodule's *working tree* has uncommitted edits, but the *pointer*
itself is clean. The `-dirty` suffix in `git diff` is a status hint,
not part of the stored SHA. You can commit safely.

If you'd rather have a clean working tree first:

```sh
cd content
git status      # see what's uncommitted there
# stash / commit / discard as appropriate
cd ..
```

### "Submodule not found" during CI build (Cloudflare Pages)

`.gitmodules` is using an SSH URL. CF Pages clones via HTTPS only.
Switch the affected entry to HTTPS:

```ini
[submodule "themes/bifrost"]
    path = themes/bifrost
    url = https://github.com/wheelofheaven/bifrost.git
```

Local SSH cloning still works — Git is fine with HTTPS URLs in
`.gitmodules` when your shell has SSH set up; CF Pages just can't
go the other direction.

## mise

### "command not found: mise" after install

You haven't activated `mise` in the current shell. Either open a new
terminal (if you added the activation line to your shell rc), or run
the activation directly:

```sh
eval "$(mise activate zsh)"   # or bash
```

### `mise install` hangs on a download

> [!NOTE]
> Usually a network blip on the GitHub releases CDN. Cancel
> (Ctrl-C) and re-run. mise resumes partial downloads.

If it fails repeatedly with a checksum error, clear mise's cache:

```sh
mise cache clear
mise install
```

### Wrong Zola version

```
$ zola --version
zola 0.19.0
```

You have a system-wide Zola installed (Homebrew, etc.) that's
shadowing the mise-managed one. Two options:

- **Preferred**: ensure `mise activate` runs before `PATH` resolves
  Zola. The mise activation sets up shim paths first.
- **Quick check**: `which zola` should resolve to a path under
  `~/.local/share/mise/installs/zola/…`. If not, mise activation isn't
  taking effect.

## Local dev server

### Port 1199 / 1112 is already in use

Another dev server is running. Either kill it or use a different port:

```sh
ZOLA_PORT=1200 mise run serve
```

The `mise.toml` task auto-increments the port if the requested one is
busy, so you can also just re-run and let it pick.

### Dev server doesn't pick up template changes

Templates *should* reload on save. If they don't:

- `Ctrl-C` and restart `mise run serve`
- Check that the template file actually saved (some editors write to
  a temp file and atomically rename — Zola's watcher catches this on
  most platforms, but not all)

### Dev server shows old content after editing markdown

Browser cache. Hard-refresh: `Cmd-Shift-R` (Mac) or `Ctrl-Shift-R`
(Win/Linux).

## Zola build

### "Theme `X` does not exist"

`config.toml` references a `[markdown.highlighting]` theme name that's
not in giallo's built-in registry. Use one of the standard tm-themes:

```toml
[markdown.highlighting]
style = "class"
light_theme = "github-light"
dark_theme  = "github-dark"
```

For class-based dual themes, Zola emits `giallo-light.css` and
`giallo-dark.css` into `static/` automatically on first build.

### "Could not find or open file X" from `get_url`

`get_url(path="X", cachebust=true)` *existence-checks* the file at
template-render time. If `X` is something Zola itself writes later
in the build (the giallo CSS files, for example), drop `cachebust`:

```tera
<link rel="stylesheet" href="{{ get_url(path='giallo-light.css') | safe }}">
```

Without `cachebust`, the URL is formed without the check.

### Build is suddenly much slower

> [!TIP]
> Usually a large image got committed unprocessed. Run:
>
> ```sh
> find content static -size +500k -type f | head
> ```
>
> Then push it through the [Image
> pipeline](@/contributing/dev/pipelines.md#image-pipeline) and use the
> CDN URL instead of embedding directly.

## Cloudflare Pages

### Build fails: "command not found: zola"

The build command isn't downloading Zola first. Check that the build
command in the CF Pages project settings starts with the curl-tar-zola
prelude:

```sh
curl -sL https://github.com/getzola/zola/releases/download/v0.22.1/zola-v0.22.1-x86_64-unknown-linux-gnu.tar.gz -o zola.tar.gz && \
    tar xzf zola.tar.gz && \
    ./zola build
```

Update the version pin to match `mise.toml`'s when you bump Zola.

### Build fails: "fatal: not a git repository"

Submodule auth issue. CF Pages uses its GitHub App credentials, which
work for HTTPS submodule URLs but not SSH. See "Submodule not found
during CI build" above.

### Preview deploys consistently fail, production succeeds

This is a known long-standing issue on the `www-wheelofheaven-io` and
`docs-wheelofheaven-world` projects. Production deploys are the ones
serving the live site and they're green. Preview deploys (preview
URLs for non-production branches) have been failing for unrelated
reasons. Safe to ignore for now.

### Site doesn't update after a successful deploy

- Cloudflare edge cache. Wait a minute, then hard-refresh.
- Submodule pointer wasn't bumped — the new content lives in
  `data-content` but `www` still points at the old commit. Bump:

  ```sh
  cd www.wheelofheaven.io
  git submodule update --remote content
  git add content && git commit -m "Update content submodule" && git push
  ```

## Search index

### Search results are stale

The search index (`/search_index.en.json`) is generated at build time.
Hard-refresh to get the new one. The dev server regenerates it on
content changes; if you're running a long-lived dev session, restart
`mise run serve`.

### Search returns nothing for a known-good query

The search index uses Zola's `truncate_content_length` (set to 2000 in
`config.toml`) which trims the body. Long-tail terms deep inside a
page may not be indexed. Try a shorter or more distinctive query.

## When the symptom isn't here

Open an issue on the [docs
repository](https://github.com/wheelofheaven/docs.wheelofheaven.world/issues)
with:

- The exact command you ran
- The exact error output
- Your OS and shell
- `zola --version`, `mise --version`, `git --version`

Most issues are easier to debug from the actual error message than
from "the build is broken."
