---
id: TSK-122
title: Listing pages: municipios photo cards, unified collection card, explorer filters
status: pending
priority: P3
tags: [styling, frontend]
created: 2026-10-18
source: RPT-050
depends-on: []
---

# Listing pages: municipios photo cards, unified collection card, explorer filters

## Description

### Description

Listing pages use inconsistent card styles (three on /colecciones alone). /municipios has text-only cards, the municipality detail list has no filtering, and the explorer filter sidebar is cut off by its own inner scroller.

See .backlog/reports/complete/RPT-050-ui-review-2026-10-19-listing-pages.md for the full directive.

## Acceptance Criteria

- [ ] /municipios uses photo cards ordered by coast (north to south)
- [ ] /municipios/$slug offers the explorer filters scoped to the municipality; "Ir al inicio" dead-end CTA replaced or removed
- [ ] /colecciones uses a single collection card style with photo covers chosen by pictureQualityScore; nudist icon no longer duplicates the sunset metaphor
- [ ] /colecciones/$slug shows the beach count once and merges page indicator into the results line
- [ ] /explorar filters grouped (Acceso, Ocupación as segmented controls; Necesidades; Municipio) with no inner scroller cutting content; toolbar reorganised (count left; sort, divider, Lista/Mapa right)
- [ ] 404 has primary + secondary CTA and a search input
- [ ] Visual check on all listed routes, desktop + mobile
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-10-18] Created