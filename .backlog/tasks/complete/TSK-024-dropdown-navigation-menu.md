---
id: TSK-024
title: Dropdown Navigation with Municipalities and Characteristics
status: complete
priority: P2
tags: [frontend]
created: 2026-03-27
source: manual
depends-on: []
started: 2026-03-27
completed: 2026-03-27
---

# Dropdown Navigation with Municipalities and Characteristics

## Description

As a visitor, I want a dropdown navigation menu that lets me jump directly to any municipality or beach characteristic from any page, so that I can navigate the site efficiently without extra clicks.

## Acceptance Criteria

- [x] Desktop: dropdown/mega-menu triggered on hover or click over a nav item
- [x] Municipalities section: 9 municipalities with beach count badges
- [x] Characteristics section: key filters (Accesible, Bandera azul, Nudista, etc.) with counts
- [x] Each item links directly to the filtered view or municipality page
- [x] Mobile: expandable panel within hamburger menu with same content
- [x] Smooth open/close animations
- [x] Accessible: keyboard navigable, proper aria attributes
- [x] Existing nav items (Colecciones, Mares, Comparar) remain accessible
- [x] Build passes, no visual regressions

## Context

Product parity doc ([`.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md`](../../.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md#navigation)) described the gap: production uses a dropdown with municipalities and characteristics (with counts) for one-click access from any page.

## Notes

- Counts can be fetched from the database or precomputed at build time
- Consider grouping municipalities geographically or alphabetically
- The dropdown should not obstruct page content excessively

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #024)
