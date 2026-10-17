---
id: TSK-040
title: Replace Emoji Icons with SVG Icons
status: complete
priority: P2
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-29
---

# Replace Emoji Icons with SVG Icons

## Description

As a visitor on any device, I want icons to render consistently so the site looks professional regardless of my OS or browser.

## Acceptance Criteria

- [ ] Create SVG icon components in `src/components/icons/` using `currentColor` for fill/stroke
- [ ] Replace weather emoji in `BeachCard` (6 icons: sunny, partly-cloudy, cloudy, rain, storm, fog)
- [ ] Replace service emoji in `MunicipalityCard` on `/municipios` (top 15 services)
- [ ] Replace collection theme emoji in `ColeccionesPage` (12 themed icons)
- [ ] Replace activity emoji if present in beach detail
- [ ] All icons render at consistent sizes (20x20 or 24x24) across platforms
- [ ] Icons respect parent text color via `currentColor`

## Context

UI review (2026-03-28) found emoji used as functional icons across multiple pages. Emoji rendering varies dramatically between macOS, Windows, Android, and Linux. ZWJ sequences (family emoji) fail on older devices. See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` (CC-1).

## Notes

- ~30-40 SVG icons total. Consider using a single icon sprite or individual components.
- See `.backlog/reports/complete/RPT-019-municipios-index-municipios-ui-review.md`, `.backlog/reports/complete/RPT-007-colecciones-index-colecciones-ui-review.md` for detailed directives

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #040)
