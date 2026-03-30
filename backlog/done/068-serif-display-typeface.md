# Task #068: Add Serif Display Typeface Site-Wide

## Metadata

- **Status**: done
- **Completed**: 2026-03-30
- **Priority**: P2 - Should
- **Slice**: Styling
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor, I want elegant serif headings so that the site conveys a premium, editorial aesthetic.

## Context

UI audit (2026-03-29) and home-design-motion review both identified the lack of typographic contrast as the single biggest visual gap. All headings currently use the same sans-serif font at heavy weights, creating a monotonous feel.

## Acceptance Criteria

- [x] Add a serif display typeface (Playfair Display, Cormorant Garamond, or DM Serif Display) via Google Fonts in `__root.tsx`
- [x] Create `--font-display` CSS variable and Tailwind `font-display` utility
- [x] Apply serif font to all `h1` and `h2` headings site-wide
- [x] Reduce heading font weights: h1 → `font-normal`/`font-light`, h2 → `font-semibold`; reserve `font-bold+` for badges/stats
- [x] Verify readability at all breakpoints (375px–1440px)

## Source Reports

- `reports/done/ui-audit-2026-03-29.md` — XC1, XC4, C1
- `reports/done/home-design-motion-review.md` — M7
