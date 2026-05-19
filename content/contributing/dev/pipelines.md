+++
title = "Pipelines"
description = "The build, content, and image pipelines — how raw inputs become deployable sites."
weight = 30
+++

The Wheel of Heaven ecosystem runs three pipelines that turn raw inputs
into deployable artifacts:

- **Build pipeline** — Git push → Zola build → Cloudflare deploy
- **Content pipeline** — author → review → validate → publish
- **Image pipeline** — source → process → optimize → CDN

This page covers each. For Cloudflare Pages specifics (DNS, custom domains,
headers, build environment), see
[CI & Deploy](@/contributing/dev/ci-deploy.md).

## Build pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Push    │───▶│  Clone   │───▶│  Build   │───▶│  Deploy  │
│  (Git)   │    │  (Subs)  │    │  (Zola)  │    │  (Edge)  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     ▼               ▼               ▼               ▼
 GitHub         Submodules       Static          Cloudflare
 Webhook        Initialized      HTML/CSS        Pages CDN
```

### Trigger

Every push to `main` triggers:

1. GitHub webhook notifies Cloudflare
2. Cloudflare Pages starts a build
3. Build output deployed globally on success

### Build steps

#### 1. Clone repository

Cloudflare clones the repo including submodules:

```sh
git clone --recursive <repo-url>
```

#### 2. Download Zola

Zola isn't pre-installed on CF Pages runners, so the build command
downloads it:

```sh
curl -sL https://github.com/getzola/zola/releases/download/v0.22.1/zola-v0.22.1-x86_64-unknown-linux-gnu.tar.gz -o zola.tar.gz
tar xzf zola.tar.gz
```

#### 3. Build site

For **www**:

```sh
./zola build
```

For **api** (with prebuild step):

```sh
python3 scripts/prebuild.py
./zola build
```

#### 4. Deploy

The output directory (`public/`) is deployed to the Cloudflare edge.

### Build commands by site

#### www

```sh
curl -sL <zola-url> -o zola.tar.gz && tar xzf zola.tar.gz && ./zola build
```

#### api

```sh
curl -sL <zola-url> -o zola.tar.gz && tar xzf zola.tar.gz && python3 scripts/prebuild.py && ./zola build
```

### Build output

**www:** ~1,251 HTML pages, 86 sections, compiled CSS, JS bundles, search
index (JSON), sitemap.

**api:** JSON endpoints, search index, CORS headers.

### Build duration

| Site | Typical build time |
|------|-------------------|
| www | ~30 seconds |
| api | ~15 seconds |

### Validation pipeline (data-content)

`data-content` has its own CI workflow that runs on every push and PR:

```yaml
# .github/workflows/validate.yml
name: Validate Content
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: python scripts/validate.py
```

### Deployment flow

```
data-content (push)
       │
       ├─────────────────────────────┐
       ▼                             ▼
www.wheelofheaven.io          api.wheelofheaven.io
(submodule update)            (submodule update)
       │                             │
       ▼                             ▼
Cloudflare Pages              Cloudflare Pages
       │                             │
       ▼                             ▼
  www deployed                 api deployed
```

### Rollback

#### Via Cloudflare dashboard

Pages project → Deployments → find the previous successful deployment →
"Rollback to this deploy."

#### Via Git

```sh
git revert HEAD
git push
```

New deployment with the reverted changes.

### Monitoring

Build logs live in the Cloudflare dashboard:
**Pages → Project → Deployments → (click a deployment)** for full logs.

## Content pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Author    │────▶│   Review    │────▶│  Validate   │────▶│   Publish   │
│   (Write)   │     │   (PR)      │     │   (CI)      │     │   (Deploy)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Authoring

#### 1. Clone repository

```sh
git clone git@github.com:wheelofheaven/data-content.git
cd data-content
```

#### 2. Create / edit content

Example wiki entry:

```sh
cat > wiki/new-term.md << 'EOF'
+++
title = "New Term"
description = "Brief description of the term"
template = "wiki-page.html"

[extra]
claim_type = "direct"
category = "Category Name"
+++

Main content goes here.

## Section heading

More content with [internal links](/wiki/related-term/).
EOF
```

#### 3. Validate locally

```sh
python scripts/validate.py
```

Checks: frontmatter fields, internal links, description length, title length.

#### 4. Commit and push

```sh
git add wiki/new-term.md
git commit -m "Add wiki entry: New Term"
git push
```

### Review process

1. Create a feature branch
2. Make changes
3. Open a PR against `main`
4. CI validation runs (frontmatter, links, translation coverage report)
5. Review and merge

### Translation workflow

#### 1. Identify missing translations

```sh
python scripts/i18n_dashboard.py
```

#### 2. Create translation

Mirror the English file structure:

```sh
mkdir -p de/wiki
cp wiki/elohim.md de/wiki/elohim.md
# edit with German translation
```

#### 3. Translation requirements

- Translated `title`
- Translated `description`
- Translated body content
- Template is inherited from the English source

#### 4. Use the glossary

Check `i18n/glossary.json` for consistent term translations.

### Publishing

#### Automatic deployment

1. Push to `main` in `data-content`
2. Update submodule in www:

   ```sh
   cd www.wheelofheaven.io
   git submodule update --remote content
   git add content
   git commit -m "Update content"
   git push
   ```

3. Cloudflare Pages deploys automatically.

#### Manual rebuild

Cloudflare dashboard → Pages project → Deployments → "Retry deployment."

### Content-type checklists

#### New wiki entry

- [ ] Create `wiki/term-name.md`
- [ ] Required frontmatter (`title`, `description`, `template`,
      `claim_type`)
- [ ] `[extra]` fields (`category`, `see_also`)
- [ ] Body content with internal links and references
- [ ] Run validation
- [ ] Commit + push
- [ ] Bump www submodule

#### New timeline entry

- [ ] Create `timeline/age-name.md`
- [ ] Frontmatter with `start_year`, `end_year`, `zodiac_sign`
- [ ] Include figure shortcodes for images
- [ ] Run validation
- [ ] Commit + push

#### New translation

- [ ] Create matching file in `{lang}/{section}/`
- [ ] Translate `title` + `description`
- [ ] Translate body
- [ ] Use glossary terms
- [ ] Run validation

### Quality checklist

- [ ] Title under 60 characters
- [ ] Description 150–160 characters
- [ ] Internal links working
- [ ] Images have alt text
- [ ] Six-source minimum (where applicable)
- [ ] `claim_type` set
- [ ] Spelling / grammar checked

## Image pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Source    │────▶│   Process   │────▶│   Deploy    │────▶│     CDN     │
│   Images    │     │   (Python)  │     │   (Upload)  │     │   (Edge)    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
     raw/           AVIF/WebP/JPG       assets.wheel...     Global cache
```

### Repository structure

```
data-images/
├── sources/              # high-res originals (archive)
├── raw/                  # images to process
├── processed/            # optimized output
│   ├── wiki/
│   ├── timeline/
│   └── resources/
├── scripts/
│   ├── process_images.py    # optimization
│   └── deploy_to_cdn.py     # upload
└── manifest.yaml            # processing config
```

### Processing script

```sh
python scripts/process_images.py --input raw/ --output processed/
```

Features:

- Format conversion (AVIF, WebP, JPG)
- Thumbnails at multiple sizes
- Quality / size balance
- Optional film-grain filter

Configuration in `manifest.yaml`:

```yaml
processing:
  quality:
    avif: 75
    webp: 80
    jpg: 85
  sizes:
    full: 1920
    large: 1280
    medium: 800
    thumb: 400
  grain:
    enabled: false
    intensity: 0.05
```

### Output formats

| Format | Use case | Compression |
|--------|----------|-------------|
| AVIF | Modern browsers | Best (~50% smaller) |
| WebP | Wide support | Good (~30% smaller) |
| JPG | Fallback | Baseline |

### Deployment script

```sh
python scripts/deploy_to_cdn.py --source processed/
```

Scans the processed directory, uploads to
`assets.wheelofheaven.world`, organizes by category, sets cache headers.

### Using images in content

```markdown
{{/* figure(src="wiki/elohim-creation", caption="The Elohim creating life") */}}
```

The shortcode prepends the CDN URL from config, generates `<picture>`
with format sources, and handles lazy loading.

### Workflow

1. **Source image:** add to `raw/`
2. **Process:** run the processing script
3. **Verify:** check output in `processed/`
4. **Deploy:** run the deployment script
5. **Use:** reference in content with the `figure` shortcode

### Naming convention

```
{category}-{descriptive-name}.{ext}
```

Examples:

```
wiki-elohim-symbol.jpg
timeline-age-of-aquarius-constellation.jpg
resources-book-cover-chariots.jpg
```

### Image guidelines

- **Resolution:** minimum 800 px wide; recommended 1920 px; maximum 4000 px
  (will be resized)
- **File size:** processed output is optimized automatically; target under
  ~200 KB for full-size AVIF
- **Content:** clear, high-quality, relevant, properly licensed

## Troubleshooting

### Build fails: "zola not found"

Ensure the build command downloads the Zola binary.

### Build fails: "submodule not found"

- Check `.gitmodules` uses HTTPS URLs (required for CF Pages auth)
- Verify the submodule is pushed to its remote

### Build fails: "template error"

- Check Tera syntax in templates
- Verify shortcodes exist
- Run `zola check` locally

### Slow builds

Zola is fast; slowness usually comes from large image processing or many
external fetches. Consider pre-processing heavy assets.

### "Image not found" on site

1. Check `cdn_url` in `config.toml`
2. Verify the image was actually deployed
3. Check filename spelling (case-sensitive)
