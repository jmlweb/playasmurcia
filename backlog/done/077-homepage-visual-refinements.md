# Task #077: Homepage Visual Refinements

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P3 - Nice
- **Slice**: Styling
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor landing on the homepage, I want generous spacing, stronger visual hierarchy, and polished details so that the site feels like a premium travel guide.

## Context

UI audit (2026-03-29) and homepage report identified spacing, gradient, and section layout refinements needed for a more editorial feel.

## Acceptance Criteria

- [x] Increase section padding: `py-16 sm:py-20` → `py-20 sm:py-28 lg:py-36`
- [x] Fix hero gradient overlay: `from-ocean-900/70 via-ocean-900/75 to-ocean-900/90` → `from-transparent via-ocean-900/20 to-ocean-900/80`
- [x] Increase featured beaches grid gap from `gap-x-4 gap-y-6` to `gap-6 xl:gap-8`
- [x] Redesign municipality section: reduce to 2–3 columns, add background image per municipality
- [x] Redesign "Region highlights" as full-bleed editorial strip or remove — fix third card `sm:col-span-2` stretching at 768px
- [x] Vary section header pattern (not every section same uppercase label + bold heading)
- [x] Increase secondary CTA border from `border-white/20` to `border-white/30`
- [x] Add "Ver todas las playas" link next to featured beaches heading
- [x] Fix hero buttons from `focus:` to `focus-visible:`
- [x] Add ring transition to municipality cards to avoid snap effect
- [x] Remove redundant `border-t border-gray-200` from municipalities section
- [x] Reduce hero animation delays (600ms+300ms too slow — target 400ms total)

## Source Reports

- `reports/done/ui-audit-2026-03-29.md` — I1–I4, R1, R2
- `reports/done/homepage.md` — HP2–HP9
- `reports/done/home.md` — HM1, HM2
