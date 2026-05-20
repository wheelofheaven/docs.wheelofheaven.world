+++
title = "Contributing"
description = "How to add, edit, or extend Wheel of Heaven content and tooling. Two paths: content and code."
sort_by = "weight"
weight = 20
template = "section.html"
+++

Two audiences share this section, and they don't overlap much.

## If you're a content author, translator, or fact-checker

You'll spend most of your time in
[**Contributing → Content**](@/contributing/content/_index.md). It
covers writing wiki entries, long-form Articles, Newsroom Dispatches,
adding books to the Library, translating into the 10 supported
languages, and what `claim_type` / `editorial_pass` mean.

You almost never need to touch a template, SCSS file, or pipeline
script.

## If you're a theme or tooling developer

You'll work in
[**Contributing → Dev**](@/contributing/dev/_index.md). The Bifrost
theme, the build/content/image pipelines, CI/CD, deploy chain. You'll
also probably want [Local Setup](@/contributing/dev/local-setup.md)
for the full multi-repo environment before touching anything.

## If you're trying to do both

Read both subsections. The line between "content" and "tooling" is
mostly clear (markdown lives in `data-content`; templates live in
`bifrost`), but a few things — shortcodes, frontmatter conventions —
sit on the fence.

## Before any PR

Skim [Conventions](@/getting-started/conventions.md). Five minutes;
saves the back-and-forth on file names, commit style, and markdown
quirks.
