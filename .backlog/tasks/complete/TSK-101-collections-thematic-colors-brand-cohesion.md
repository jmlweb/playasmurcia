---
id: TSK-101
title: Collections Index — Thematic Colors Aligned With Brand
status: complete
priority: P2
tags: [styling]
created: 2026-04-04
source: manual
depends-on: []
completed: 2026-04-04
---

# Collections Index — Thematic Colors Aligned With Brand

## Description

As a visitor on `/colecciones`, I want the thematic cards to feel part of the same coastal brand as the rest of the site, not like a generic multi-color app grid.

## Acceptance Criteria

- [x] Replace or narrow `ThematicThemes` so category distinction uses **harmonized** colors derived from ocean/sand/coral tokens (or a small, documented exception set that still reads as one brand).
- [x] Keep per-card differentiation (users must still scan categories quickly); prefer lightness/saturation steps or ocean-adjacent tints over unrelated hues (pink, purple, indigo, etc.) unless explicitly justified in guidelines.
- [x] If **coral** remains a deliberate third accent (overline, highlights), add it to the color palette table in `docs/ui-guidelines.md` with allowed usages.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Context

UI review (color focus, Playwright, 2026-04-04). Full directive: `.backlog/reports/complete/RPT-035-ui-review-color-focus-2026-04-04.md`. `src/routes/colecciones/index.tsx` uses many distinct Tailwind hue families (`teal`, `amber`, `rose`, `purple`, etc.) for `ThematicThemes`, which conflicts with `docs/ui-guidelines.md` (“Avoid introducing new brand colors without clear justification”) and the `@theme` ocean/sand tokens in `src/styles.css`.

## Files to Modify

- `src/routes/colecciones/index.tsx` (`ThematicThemes` and any related class names)
- `docs/ui-guidelines.md` (palette / exceptions)

## Dependencies

- None

## Notes

## Learnings

## Progress Log

- [2026-04-04] Task created from UI review (colors).
- [2026-04-04] Completed: ThematicThemes narrowed to ocean/sand/teal/cyan/sky/amber families, coral documented in ui-guidelines.md palette.
- [2026-10-17] Migrated from legacy backlog/ (originally task #101)
