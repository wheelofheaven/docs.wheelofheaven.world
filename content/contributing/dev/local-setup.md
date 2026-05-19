+++
title = "Local Setup"
description = "Full local dev environment — Zola, mise, submodules, the data repos, and validation scripts."
weight = 10
+++

The fast path for newcomers is [Quickstart](@/getting-started/quickstart.md).
This page covers the *full* dev environment for theme, pipeline, and
content-validation work.

## Prerequisites

- **Git** — version control
- **[mise](https://mise.jdx.dev/)** — task runner (recommended); installs Zola
- **Python 3.11+** — scripts and content validation
- **Node.js** — optional, for advanced tooling (bifrost dev)

## Quick start

### 1. Clone with submodules

```sh
git clone --recursive git@github.com:wheelofheaven/www.wheelofheaven.io.git
cd www.wheelofheaven.io
```

Or if already cloned:

```sh
git submodule update --init --recursive
```

### 2. Install mise

```sh
# macOS
brew install mise

# or via installer
curl https://mise.run | sh
```

Add to your shell:

```sh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
```

### 3. Install Zola

```sh
# via mise (respects mise.toml's pinned version)
mise install

# or via Homebrew (uses whatever version brew has)
brew install zola
```

### 4. Start dev server

```sh
mise run serve
```

Site available at <http://127.0.0.1:1199>.

## Per-repo setup

### www.wheelofheaven.io (deployed at www.wheelofheaven.world)

```sh
git clone --recursive git@github.com:wheelofheaven/www.wheelofheaven.io.git
cd www.wheelofheaven.io
mise run serve
```

### api.wheelofheaven.io (deployed at api.wheelofheaven.world)

```sh
git clone --recursive git@github.com:wheelofheaven/api.wheelofheaven.io.git
cd api.wheelofheaven.io
mise run serve
```

### bifrost (theme development)

```sh
git clone git@github.com:wheelofheaven/bifrost.git
cd bifrost
# theme is tested via the www repo
```

### data-content (content editing)

```sh
git clone git@github.com:wheelofheaven/data-content.git
cd data-content
python scripts/validate.py    # check content
```

## mise tasks

All repos use mise for consistent task running.

```toml
# mise.toml (www example)
[tools]
zola = "0.22.0"

[tasks.serve]
run = "zola serve --port 1199"

[tasks.build]
run = "zola build"

[tasks.check]
run = "zola check"

[tasks.clean]
run = "rm -rf public || true"
```

### Common commands

```sh
mise run serve    # dev server
mise run build    # production build
mise run check    # validate site
mise run clean    # remove build output
```

## Submodule workflow

### Update submodules

```sh
# update all submodules to latest
git submodule update --remote

# update a specific submodule
git submodule update --remote content
```

### After updating

```sh
git add content
git commit -m "Update content submodule"
git push
```

### Working inside a submodule

```sh
cd content   # or themes/bifrost

# make changes
git add .
git commit -m "Your changes"
git push

# back to parent
cd ..
git add content
git commit -m "Update content submodule"
```

## Development workflows

### Content changes

1. Edit files in the `content/` submodule
2. Preview with `mise run serve`
3. Commit to the `data-content` repo
4. Update submodule pointer in www

### Theme changes

1. Edit files in `themes/bifrost/`
2. Preview with `mise run serve`
3. Commit to the `bifrost` repo
4. Update submodule pointer in www

### Validation

```sh
# content validation
cd content
python scripts/validate.py

# translation coverage
python scripts/i18n_dashboard.py
```

## Directory layout after setup

```
wheelofheaven/
├── www.wheelofheaven.io/
│   ├── content/          # ← data-content
│   ├── data/library/     # ← data-library
│   └── themes/bifrost/   # ← bifrost
├── api.wheelofheaven.io/
│   ├── data/content/     # ← data-content
│   └── data/library/     # ← data-library
├── bifrost/              # standalone for dev
├── data-content/         # standalone for editing
├── data-library/         # standalone for editing
├── data-images/          # image pipeline
└── docs.wheelofheaven.world/
```

## Troubleshooting

### "Template not found"

Ensure the `bifrost` submodule is initialized:

```sh
git submodule update --init themes/bifrost
```

### "Content not found"

Ensure the `content` submodule is initialized:

```sh
git submodule update --init content
```

### "Zola not found"

Install via mise:

```sh
mise install
```

Or check that your `PATH` includes Zola.

### Build errors

Check Zola version:

```sh
zola --version   # should be 0.22.0+
```

Run diagnostics:

```sh
mise run check
```
