---
id: TSK-100
title: Municipality Listing — Home Link Affordance
status: complete
priority: P3
tags: [styling]
created: 2026-04-04
source: manual
depends-on: []
completed: 2026-04-04
---

# Municipality Listing — Home Link Affordance

## Description

As a user at the bottom of a municipality beach listing, I want the link to the homepage to look like “home”, not like browser “back”, so I trust where the control goes before I tap.

## Acceptance Criteria

- [x] Replace misleading leading arrow on the municipality listing footer link with a home/root affordance (e.g. house icon + “Ir al inicio” or equivalent Spanish copy consistent with `docs/ui-guidelines.md` tone).
- [x] Keep `← Volver a colecciones` on collection detail unchanged (parent navigation is correct).
- [x] Focus-visible ring matches existing ocean focus tokens.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Context

UI review (Playwright, 2026-04-04). Full directive: `.backlog/reports/complete/RPT-039-ui-review-municipality-listing-municipioscartagena.md`. The control `← Volver al inicio` navigates to `/` but the left arrow implies history/back.

## Files to Modify

- `src/routes/municipios/$slug.tsx` (approx. lines 199–205)
- `src/components/ui/icons.tsx` only if a reusable home icon is needed

## Dependencies

- None

## Notes

## Learnings

## Progress Log

- [2026-04-04] Task created from UI review.
- [2026-04-04] Completed: replaced ← arrow with house SVG icon, changed copy to "Ir al inicio".
- [2026-10-17] Migrated from legacy backlog/ (originally task #100)
