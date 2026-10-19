---
id: TSK-122
title: Listing pages: municipios photo cards, unified collection card, explorer filters
status: complete
priority: P3
tags: [styling, frontend]
created: 2026-10-18
source: RPT-050
depends-on: []
started: 2026-10-19
completed: 2026-10-19
---

# Listing pages: municipios photo cards, unified collection card, explorer filters

## Description

### Description

Listing pages use inconsistent card styles (three on /colecciones alone). /municipios has text-only cards, the municipality detail list has no filtering, and the explorer filter sidebar is cut off by its own inner scroller.

See .backlog/reports/complete/RPT-050-ui-review-2026-10-19-listing-pages.md for the full directive.

## Acceptance Criteria

- [x] /municipios uses photo cards ordered by coast (north to south) — evidence: manual: /municipios screenshot shows 8 photo cards; coast order via sortMunicipalitiesByCoast, pnpm vitest nav-builders → pass (2026-10-20)
- [x] /municipios/$slug offers the explorer filters scoped to the municipality; "Ir al inicio" dead-end CTA replaced or removed — evidence: manual: /municipios/cartagena screenshot shows ChipFilterBar (Acceso, Ocupación, Necesidades); 'Ver otros municipios' replaces 'Ir al inicio'; chip-filter-bar tests → pass (2026-10-20)
- [x] /colecciones uses a single collection card style with photo covers chosen by pictureQualityScore; nudist icon no longer duplicates the sunset metaphor — evidence: manual: /colecciones screenshot shows one CollectionCard style, covers via pickCoverPicture; icons dropped; collection-covers tests → pass (2026-10-20)
- [x] /colecciones/$slug shows the beach count once and merges page indicator into the results line — evidence: manual: /colecciones/bandera-azul screenshot shows '35 playas · página 1 de 3' once, hero pill removed (2026-10-20)
- [x] /explorar filters grouped (Acceso, Ocupación as segmented controls; Necesidades; Municipio) with no inner scroller cutting content; toolbar reorganised (count left; sort, divider, Lista/Mapa right) — evidence: manual: /explorar screenshot at 1280x800 shows grouped filters, no inner scroller, toolbar count left, sort | divider | Lista/Mapa right (2026-10-20)
- [x] 404 has primary + secondary CTA and a search input — evidence: manual: unknown-URL screenshot shows primary + secondary CTA and search input (2026-10-20)
- [x] Visual check on all listed routes, desktop + mobile — evidence: manual: screenshots desktop + mobile (--full-page) of /municipios, /municipios/cartagena, /colecciones, /colecciones/bandera-azul, /explorar, 404 (2026-10-20)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, pnpm test (352 passed), pnpm check → exit 0 (2026-10-20)

## Notes

## Learnings

- LRN-021: Coast order needs a hand-written list, not mean latitude
## Progress Log

- [2026-10-18] Created
- [2026-10-19] Started
- [2026-10-19] Completed