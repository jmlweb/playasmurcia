# Task #069: Add Photo Backgrounds to PageHero

## Metadata

- **Status**: done
- **Completed**: 2026-03-30
- **Priority**: P2 - Should
- **Slice**: Styling
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor, I want immersive hero sections with coastal photography so that listing pages feel as visually rich as the homepage.

## Context

UI audit (2026-03-29) flagged Explorer, Collections, and Municipalities pages as having flat gradient-only heroes. The homepage already uses a photo hero effectively.

## Acceptance Criteria

- [x] Extend `PageHero` component with `backgroundImage` + `backgroundAlt` props
- [x] Apply photo backgrounds to Explorer (`/explorar`), Collections Index (`/colecciones`), and Municipalities Index (`/municipios`)
- [x] Ensure proper gradient overlay for text contrast (WCAG AA)
- [x] Increase PageHero padding to 100–140px range (`py-20 sm:py-28 lg:py-32`)
- [x] Either make decorative blur circle more prominent (`opacity-20`, larger) or remove it

## Source Reports

- `reports/done/ui-audit-2026-03-29.md` — XC2, C6, C7, PH1, PH2
- `reports/done/explorer.md` — EXP5
