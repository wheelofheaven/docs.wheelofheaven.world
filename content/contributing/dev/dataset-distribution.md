+++
title = "Dataset Distribution"
description = "How the CC0 datasets are packaged and mirrored to HuggingFace and Kaggle — the build_distribution.py packager, the upload flow, and how to update a mirror."
template = "page.html"
weight = 37
+++

The Wheel of Heaven [datasets](/reference/datasets/) live primarily on the API
(`/v1/datasets/`, `/v1/graph/`) with human-facing landing pages on www. Because
they are CC0, we also mirror them to high-authority data platforms — for
backlinks, for reach into the ML and data-science communities, and for a second
discovery surface. This page documents that packaging and upload pipeline.

## Why HuggingFace + Kaggle (and not a DOI repository)

We evaluated Zenodo and the other DOI-minting archives first. Zenodo
automatically **de-ranks uploads from unverified individual accounts** — hiding
them from its own search while leaving them visible to duplicate-checkers —
which would defeat the discoverability goal the mirrors exist to serve.
HuggingFace and Kaggle give high-authority backlinks and a real audience without
that risk, and **Kaggle is itself a Google Dataset Search source**, so it
restores the second Dataset-Search listing without a DOI. If academic DOIs
become worthwhile later, **Harvard Dataverse** and **OSF** are the
individual-friendly, Dataset-Search-indexed options (both mint DataCite DOIs,
neither de-ranks individuals).

## The packager

`api.wheelofheaven.world/scripts/build_distribution.py` assembles a
self-contained upload folder per dataset per platform. Stdlib only; no network
and no accounts, so it is fully runnable offline.

```
python scripts/build_distribution.py --kaggle-user <handle>
```

Output lands under `scripts/dist/` (git-ignored):

```
scripts/dist/
├── huggingface/<slug>/   # README.md dataset card + data files
└── kaggle/<slug>/        # dataset-metadata.json + data files
```

The dataset list and metadata (title, subtitle, blurb, keywords, columns, files,
landing URL) live in the `DATASETS` table at the top of the script — add an
entry there to include a new dataset in the mirrors.

- **HuggingFace card** — YAML frontmatter (`license: cc0-1.0`, `pretty_name`,
  `tags`, `language`) plus a markdown body with the record count, column list,
  provenance, and a citation line.
- **Kaggle metadata** — `dataset-metadata.json` with `title`, a 20–80-character
  `subtitle` (Kaggle enforces that range — the packager fails loudly if a
  subtitle falls outside it), `licenses: CC0-1.0`, `keywords`, and one
  `resources` entry per file. The `id` is `<owner>/<slug>`, filled from
  `--kaggle-user`.

## HuggingFace upload

The datasets live under the
[`wheelofheaven`](https://huggingface.co/wheelofheaven) organization. Uploading
uses the `hf` CLI (the modern replacement for the deprecated `huggingface-cli`):

```
pip install -U huggingface_hub
hf auth login                      # paste a WRITE-scope token
for s in content-graph flood-myths divine-council-index theomachy-crossrefs world-ages prophets-and-religions; do
  hf upload wheelofheaven/$s scripts/dist/huggingface/$s --repo-type=dataset
done
```

`hf upload` auto-creates the dataset repo on first push. Verify via the public
API: `https://huggingface.co/api/datasets?author=wheelofheaven`.

**Namespace note.** HuggingFace users and organizations share one namespace, so
standing up the `wheelofheaven` org required renaming the personal account to
`zarazinsfuss` first — a one-time, self-serve username change — to free the
`wheelofheaven` handle. Do not delete an account to free a handle: a deleted
namespace returns to the public pool immediately and can be re-registered by
anyone.

## Kaggle upload

The datasets are live under the personal account
[`zarazinsfuss`](https://www.kaggle.com/zarazinsfuss). Kaggle users and
organizations do **not** share a namespace, so no renaming was needed — but note
Kaggle has **suspended organization creation for regular users**, so there is no
`wheelofheaven` Kaggle org; the personal account is the owner (this is the Kaggle
norm and costs nothing in discoverability). Set `--kaggle-user zarazinsfuss` when
packaging, then:

```
pip install kaggle           # needs a phone-verified account + API credential (see below)
for s in content-graph flood-myths divine-council-index theomachy-crossrefs world-ages prophets-and-religions; do
  kaggle datasets create -p scripts/dist/kaggle/$s --public
done
```

Three gotchas:

- **`--public` is required.** `kaggle datasets create` defaults to *private*.
- **Credential.** The CLI authenticates from `~/.kaggle/kaggle.json` (classic
  username+key) *or* the newer `~/.kaggle/access_token` — the Kaggle CLI (≥2.2)
  reads either. A phone-verified account is required to publish.
- **Tags.** Kaggle uses a **controlled tag vocabulary**; free-text keywords in
  `dataset-metadata.json` are silently rejected on upload ("not valid tags"), so
  the datasets currently publish untagged. Mapping to valid Kaggle tag slugs and
  re-versioning is an optional polish.

## Updating a mirror

When a source dataset changes (a regenerated graph, an edited CSV):

1. Rebuild the packages: `python scripts/build_distribution.py --kaggle-user <handle>`
2. **HuggingFace** — re-run `hf upload …` for the changed slug; it commits a new
   revision to the existing repo.
3. **Kaggle** — `kaggle datasets version -p scripts/dist/kaggle/<slug> -m "notes"`
   (use `version`, not `create`, once the dataset exists).
