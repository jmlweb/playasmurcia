# Task #072: Beach Detail Visual Polish

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P3 - Nice
- **Slice**: Styling
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor on a beach detail page, I want a polished, immersive layout so that the page feels like a premium travel guide.

## Context

UI audit (2026-03-29) identified several refinement opportunities on the beach detail page beyond the widget-specific redesigns.

## Acceptance Criteria

- [x] Increase hero height from `h-64 sm:h-80 lg:h-96` to `h-72 sm:h-96 lg:h-[32rem]` or `min-h-[50vh]`
- [x] Add lightbox to BeachGallery (even native `<dialog>`)
- [x] Differentiate ServicesGrid vs ActivitiesGrid visually (e.g., `bg-ocean-50` vs `bg-amber-50`)
- [x] Replace generic "Sobre esta playa" heading with beach name or remove it
- [x] Move CertificationsBadge into hero overlay or description card
- [x] Remove per-item `border`/`shadow` on ServicesGrid and ActivitiesGrid inside parent card (use pill/tag style)
- [x] Constrain hero h1 max-width on ultra-wide viewports
- [x] Increase ContactInfo icons from `h-4 w-4` to `h-5 w-5`
- [x] Increase FlagCircle in BeachStatusWidget from `h-4 w-4` to `h-5 w-5`

## Source Reports

- `reports/done/ui-audit-2026-03-29.md` — I6, I7, I8, R3, R5, SGA1, CI1, BSW1
- `reports/done/beach-detail.md` — BD4
