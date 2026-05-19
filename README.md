# docs.wheelofheaven.world

The Wheel of Heaven documentation site — for content authors, translators,
theme developers, and anyone trying to understand how the project's
multi-repo organization fits together.

Lives at <https://docs.wheelofheaven.world>.

## Stack

- [Zola](https://www.getzola.org/) 0.22.1
- Custom `docs-theme` (in `themes/docs-theme/`) that imports the Bifrost
  design tokens for visual continuity with the main site
- [mise](https://mise.jdx.dev/) for tool versioning
- Cloudflare Pages for hosting

## Local development

```sh
mise install        # install zola at the pinned version
mise run serve      # dev server with live reload
mise run build      # one-off build into ./public
mise run check      # run zola check
```

The dev server auto-picks a free port starting at 1112 (so it doesn't
clash with the main site on 1111).

## Repository layout

```
docs.wheelofheaven.world/
├── config.toml
├── mise.toml
├── content/                    # site content (markdown)
├── static/                     # static assets served at /
├── themes/
│   └── docs-theme/             # custom theme — templates + SCSS
└── .github/workflows/
    └── deploy.yml              # build + deploy to gh-pages branch
```

## Deploy

CI builds on push to `main` and deploys `/public` to the `gh-pages` branch.
Cloudflare Pages watches `gh-pages` and rebuilds the live site.

## License

CC0-1.0 (Public Domain)
