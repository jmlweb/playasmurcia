# Task #100: Municipality Listing — Home Link Affordance

## Metadata

- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-04-04
- **Blocked by**: -

## User Story

As a user at the bottom of a municipality beach listing, I want the link to the homepage to look like “home”, not like browser “back”, so I trust where the control goes before I tap.

## Context

UI review (Playwright, 2026-04-04). Full directive: `reports/done/ui-review-2026-04-04-municipio-detail.md`. The control `← Volver al inicio` navigates to `/` but the left arrow implies history/back.

## Acceptance Criteria

- [ ] Replace misleading leading arrow on the municipality listing footer link with a home/root affordance (e.g. house icon + “Ir al inicio” or equivalent Spanish copy consistent with `docs/ui-guidelines.md` tone).
- [ ] Keep `← Volver a colecciones` on collection detail unchanged (parent navigation is correct).
- [ ] Focus-visible ring matches existing ocean focus tokens.
- [ ] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Files to Modify

- `src/routes/municipios/$slug.tsx` (approx. lines 199–205)
- `src/components/ui/icons.tsx` only if a reusable home icon is needed

## Dependencies

- None

## Progress Log

- [2026-04-04] Task created from UI review.
