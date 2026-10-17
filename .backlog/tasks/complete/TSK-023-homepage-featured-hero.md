---
id: TSK-023
title: Homepage Featured Beaches + Editorial Hero
status: complete
priority: P2
tags: [fullstack]
created: 2026-03-27
source: manual
depends-on: []
started: 2026-03-27
completed: 2026-03-27
---

# Homepage Featured Beaches + Editorial Hero

## Description

As a visitor, I want to see a curated selection of featured beaches on the homepage with an inspiring hero section, so that I get a sense of the destination and can quickly find top recommendations without being overwhelmed by the full listing.

## Acceptance Criteria

- [x] Hero section with editorial copy promoting Costa Calida and the region
- [x] Responsive typography with animation (fade-up or similar)
- [x] Featured beaches section showing ~10 curated beaches in a grid
- [x] Selection criteria defined (e.g. best photos, blue flag, geographic spread)
- [x] "Ver todas las playas" CTA linking to the full explorer with filters
- [x] Grid: 1 col mobile, 2 col tablet, 3 col desktop, 4 col large
- [x] Beach cards maintain existing design (image, municipality, tags)
- [x] Full explorer with filters moved to a dedicated `/explorar` route (or similar)
- [x] Build passes, no visual regressions on other pages

## Context

Product parity doc ([`.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md`](../../.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md#home-and-hero)) described the gap: homepage should show curated featured beaches and an editorial hero instead of only dumping the full list.

## Notes

- The featured selection could be a curated list in the database or a query (e.g. beaches with photos + blue flag + diverse municipalities)
- The full filter/search experience should remain accessible, just not be the landing page
- Consider keeping a compact search bar in the hero for users who know what they want

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #023)
