---
id: TSK-068
title: Add Serif Display Typeface Site-Wide
status: complete
priority: P2
tags: [styling]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Add Serif Display Typeface Site-Wide

## Description

As a visitor, I want elegant serif headings so that the site conveys a premium, editorial aesthetic.

## Acceptance Criteria

- [x] Add a serif display typeface (Playfair Display, Cormorant Garamond, or DM Serif Display) via Google Fonts in `__root.tsx`
- [x] Create `--font-display` CSS variable and Tailwind `font-display` utility
- [x] Apply serif font to all `h1` and `h2` headings site-wide
- [x] Reduce heading font weights: h1 → `font-normal`/`font-light`, h2 → `font-semibold`; reserve `font-bold+` for badges/stats
- [x] Verify readability at all breakpoints (375px–1440px)

## Context

UI audit (2026-03-29) and home-design-motion review both identified the lack of typographic contrast as the single biggest visual gap. All headings currently use the same sans-serif font at heavy weights, creating a monotonous feel.

## Source Reports

- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — XC1, XC4, C1
- `.backlog/reports/complete/RPT-014-home-page-design-and-motion.md` — M7

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #068)
