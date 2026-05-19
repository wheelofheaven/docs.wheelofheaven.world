+++
title = "Quickstart"
description = "From clone to live preview in under five minutes."
weight = 10
+++

> Placeholder — full content lands in Phase 4.

## Prerequisites

You'll need:

- A recent Git
- [`mise`](https://mise.jdx.dev/) (installs Zola and node at the pinned versions)

## Clone

```sh
git clone --recurse-submodules git@github.com:wheelofheaven/www.wheelofheaven.io.git
cd www.wheelofheaven.io
```

The `--recurse-submodules` flag is important — content and the
Bifrost theme are submodules.

## Install tools

```sh
mise install
```

## Run the dev server

```sh
mise run serve
```

Open the URL it prints (usually `http://127.0.0.1:1111`).

## Next steps

- [Project map](@/getting-started/project-map.md) — what each repo does
- [Conventions](@/getting-started/conventions.md) — file naming, branches, commit style
