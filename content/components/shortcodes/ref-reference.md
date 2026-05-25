+++
title = "ref + reference"
description = "Two thin reference-marker shortcodes. `ref` is number-only; `reference` supports both keys and numbers."
template = "page.html"
weight = 80
+++

Two reference-marker shortcodes besides [`cite`](../cite/). They
exist to support different reference styles inside markdown.

## `ref`

Source: [`templates/shortcodes/ref.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/ref.html)

Number-only marker — for legacy / numbered reference styles.

```markdown
…claimed by Sitchin{{/* ref(num=12) */}}.
```

| Param    | Type    | Required | Default       | What                          |
|----------|---------|----------|---------------|-------------------------------|
| `num`    | number  | no       | `?`           | Reference number; anchors to `#ref-<num>`. |
| `title`  | string  | no       | `"Reference"` | Tooltip text.                 |

Output:
```html
<sup class="wiki-ref">
    <a href="#ref-12" class="wiki-ref__link" title="Reference">[12]</a>
</sup>
```

## `reference`

Source: [`templates/shortcodes/reference.html`](https://github.com/wheelofheaven/bifrost/blob/main/templates/shortcodes/reference.html)

Key-or-number marker. Use when references are identified by string keys
(e.g. `sitchin-1976`) rather than numbers.

```markdown
…claimed by Sitchin{{/* reference(key="sitchin-1976") */}}.
…claimed by Sitchin{{/* reference(number=12) */}}.
```

| Param    | Type    | Required          | Default | What                                              |
|----------|---------|-------------------|---------|---------------------------------------------------|
| `key`    | string  | yes (or `number`) | `""`    | Reference key; anchors to `#ref-<key>`.           |
| `number` | number  | yes (or `key`)    | `""`    | Reference number; anchors to `#ref-<number>`.     |
| `text`   | string  | no                | key/number | Visible marker text.                          |

Output:
```html
<sup class="wiki-reference">
    <a href="#ref-sitchin-1976" class="wiki-reference__link" title="…">[sitchin-1976]</a>
</sup>
```

## Which one should I use?

| Style                              | Use                                               |
|------------------------------------|---------------------------------------------------|
| Inline citation (most common)      | [`cite`](../cite/) — preferred default.    |
| Numbered-list references           | `ref`                                      |
| Key-based / author-year references | `reference`                                |
