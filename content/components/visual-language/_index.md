+++
title = "Visual language"
description = "Bifrost's two glass recipes: the cloud-duo gradient for premium CTAs and lead cards, and the navbar's quiet chrome glass for floating surfaces."
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

There is a second, unrelated glass recipe. `glass-cloud` is for surfaces
that should draw the eye; **[`chrome-glass`](chrome-glass/)** is for
surfaces that should not — floating chrome that reads as the same
material as the navbar. It adds no gradient and no animation.

| Mixin                              | Shape | Use for                                                |
|------------------------------------|-------|--------------------------------------------------------|
| [`chrome-glass`](chrome-glass/)    | Any   | Floating chrome and overlay panels: control clusters, map legends, popovers above a page rather than in it. |

Do not reach for `glass-cloud` on chrome. The cloud-duo gradient makes a
control cluster the loudest thing on the page — which is how the map's
zoom controls ended up with cyan and mauve blobs behind their icons.

Both expose two CSS custom properties (`--cloud-a`, `--cloud-b`) that
adopters override per instance to pick a duo from the Bifrost 300-tier
palette. Pick a duo that fits the **prominence** and **mood** of the
surface — cool/quiet duos for utility, vibrant duos for lead positions.
