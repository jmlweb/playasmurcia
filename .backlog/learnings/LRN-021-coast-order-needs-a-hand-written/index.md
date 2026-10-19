---
id: LRN-021
title: Coast order needs a hand-written list, not mean latitude
status: active
tags: [data, frontend-ui]
task: TSK-122
created: 2026-10-19
---

## Context
/municipios must list towns along the coast, north-east to south-west. First attempt sorted by the mean latitude of each municipality's beaches.

## Insight
Mean latitude misorders the coast: Los Alcázares came before San Javier, and Lorca before Águilas, against the RPT-050 order. The coastline is a path, not a north-south line.

## Application
Use the explicit slug list `COAST_ORDER` in `src/lib/nav-builders.ts`. Add new municipalities there; unknown slugs sort last. Attach covers before sorting or filtering, because `Beach.municipality` is an index into the unsorted municipality list.
