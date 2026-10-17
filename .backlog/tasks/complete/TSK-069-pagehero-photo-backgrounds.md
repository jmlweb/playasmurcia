---
id: TSK-069
title: Add Photo Backgrounds to PageHero
status: complete
priority: P2
tags: [styling]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Add Photo Backgrounds to PageHero

## Description

As a visitor, I want immersive hero sections with coastal photography so that listing pages feel as visually rich as the homepage.

## Acceptance Criteria

- [x] Extend `PageHero` component with `backgroundImage` + `backgroundAlt` props
- [x] Apply photo backgrounds to Explorer (`/explorar`), Collections Index (`/colecciones`), and Municipalities Index (`/municipios`)
- [x] Ensure proper gradient overlay for text contrast (WCAG AA)
- [x] Increase PageHero padding to 100–140px range (`py-20 sm:py-28 lg:py-32`)
- [x] Either make decorative blur circle more prominent (`opacity-20`, larger) or remove it

## Context

UI audit (2026-03-29) flagged Explorer, Collections, and Municipalities pages as having flat gradient-only heroes. The homepage already uses a photo hero effectively.

## Source Reports

- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — XC2, C6, C7, PH1, PH2
- `.backlog/reports/complete/RPT-012-design-directive-explorer.md` — EXP5

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #069)
