+++
title = "Quickstart"
description = "From clone to live preview in under five minutes — the fast path for a first-time contributor."
weight = 10
+++

The fastest path from nothing to a working local preview of
`www.wheelofheaven.world`. If anything below takes longer than five
minutes, something is wrong — open an issue.

## Prerequisites

You need exactly two things:

- **Git** (any recent version)
- **[mise](https://mise.jdx.dev/)** — installs the right Zola version
  per-repo

Everything else (Zola, Python, Node) is installed *by* mise based on the
repo's `mise.toml`. You do not need to install Zola separately.

## 1. Install mise

```sh
# macOS (Homebrew)
brew install mise

# or anywhere with curl
curl https://mise.run | sh
```

Then add it to your shell so it activates in new terminal sessions:

```sh
# zsh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc

# bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
```

Open a new terminal so the change takes effect.

## 2. Clone the main site

```sh
git clone --recurse-submodules \
    git@github.com:wheelofheaven/www.wheelofheaven.io.git
cd www.wheelofheaven.io
```

The `--recurse-submodules` flag is **load-bearing** — content lives in
`data-content` and the theme lives in `bifrost`, both pulled in as
submodules. Without it, the site won't build.

(If you forgot the flag, recover with
`git submodule update --init --recursive`.)

## 3. Install Zola and friends

```sh
mise install
```

This reads `mise.toml`, installs Zola at the pinned version (currently
0.22.0), plus Python and Node. First run takes ~30 seconds; subsequent
runs are instant.

## 4. Serve

```sh
mise run serve
```

You should see something like:

```
Web server is available at http://127.0.0.1:1199 (bound to 127.0.0.1:1199)
```

Open that URL in a browser. The dev server hot-reloads on every
file change.

## You're done

You now have a working local copy of the main knowledge base. Some good
next steps:

- **Read [Project Map](@/getting-started/project-map.md)** — understand
  what each of the ~19 repos in the org does, and how they connect.
- **Read [Conventions](@/getting-started/conventions.md)** — file names,
  branches, commit style. Five minutes; saves PR-review churn later.
- **Find something to do** — check the
  [Issues tab](https://github.com/wheelofheaven/data-content/issues)
  on `data-content` for content tasks, or
  [bifrost](https://github.com/wheelofheaven/bifrost/issues) for
  theme/code work.

## Common stumbling blocks

### "git@github.com: Permission denied (publickey)"

You need to add your SSH key to GitHub. See
[GitHub's docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).
If you'd rather use HTTPS, clone with
`https://github.com/wheelofheaven/www.wheelofheaven.io.git` instead.

### "Template not found"

The `bifrost` submodule isn't initialized. Run:

```sh
git submodule update --init themes/bifrost
```

### "Content not found"

The `data-content` submodule isn't initialized. Run:

```sh
git submodule update --init content
```

### "command not found: mise" after install

You haven't activated mise in your shell yet. Re-do step 1, then open a
new terminal.

### Port 1199 is busy

Some other dev server is running on that port. Use a different port:

```sh
ZOLA_PORT=1200 mise run serve
```

For the *full* dev environment (api, theme work, content validation
scripts), see [Local Setup](@/contributing/dev/local-setup.md).
