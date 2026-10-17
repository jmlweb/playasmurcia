---
id: TSK-074
title: Collections Visual Upgrade
status: complete
priority: P3
tags: [styling]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Collections Visual Upgrade

## Description

As a visitor browsing collections, I want visually rich collection cards so that I can feel the character of each collection before clicking.

## Acceptance Criteria

- [x] Add hero image to each CollectionCard (representative photo or theme-color gradient)
- [x] Feature 3–4 "hero" collections as larger cards with images; rest in compact format
- [x] Make sea collection cards into horizontal banner-style with coastal photo background
- [x] Standardize CollectionIcon sizing (sea `h-14 w-14` vs thematic `h-10 w-10`)
- [x] Standardize CTA text (sea "Explorar" vs thematic "Ver colección" — pick one)
- [x] Add subtle `sand-100` background behind "Colecciones temáticas" block
- [x] If amber/orange bars confuse users, shift one toward a cooler hue

## Context

UI audit (2026-03-29) flagged collection cards as text-heavy with no imagery. Sea vs thematic collections have inconsistent sizing and CTAs.

## Source Reports

- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — I12–I14, R8, R9
- `.backlog/reports/complete/RPT-007-colecciones-index-colecciones-ui-review.md` — CI1, CI2

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #074)
