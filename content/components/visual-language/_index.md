+++
title = "Visual language"
description = "Glass + drifting cloud-duo gradient — the recipe Bifrost uses for premium CTAs and lead cards. Two adoption mixins: glass-cloud-card and glass-cloud-button."
sort_by = "weight"
weight = 10

[extra]
summary = "The premium-CTA visual recipe. One animated background treatment, two adoption mixins (card and button shapes). All lead cards and high-prominence CTAs across the site share this language."
+++

Bifrost has a single canonical recipe for surfaces that need lead-card
or premium-CTA prominence: a frosted-glass blur on top of a slowly
drifting two-colour gradient ("cloud-duo"). The recipe is centralised in
two mixins so adopters never reinvent the background treatment.

| Mixin                                          | Shape   | Use for                                  |
|------------------------------------------------|---------|------------------------------------------|
| [`glass-cloud-card`](glass-cloud-card/)        | Card    | Lead cards on section landings, reading-path tiles, lead Dispatch on /news/. |
| [`glass-cloud-button`](glass-cloud-button/)    | Button  | In-content CTAs that should feel premium ("Read in *Book*", utility footers). |

Both expose two CSS custom properties (`--cloud-a`, `--cloud-b`) that
adopters override per instance to pick a duo from the Bifrost 300-tier
palette. Pick a duo that fits the **prominence** and **mood** of the
surface — cool/quiet duos for utility, vibrant duos for lead positions.
