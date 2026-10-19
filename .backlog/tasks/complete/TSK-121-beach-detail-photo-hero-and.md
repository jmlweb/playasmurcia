---
id: TSK-121
title: Beach detail: photo hero and gallery mosaic, calmer practical info
status: complete
priority: P2
tags: [styling, frontend, beach-detail]
created: 2026-10-18
source: RPT-049
depends-on: []
started: 2026-10-19
completed: 2026-10-19
---

# Beach detail: photo hero and gallery mosaic, calmer practical info

## Description

### Description

The most important page has no photo at the top. It opens with a flat teal band and shows photos as small tiles further down. Practical info overuses semantic colors (red for "Alta" occupancy), and the nearby carousel is clipped.

See .backlog/reports/complete/RPT-049-ui-review-2026-10-19-beach-detail.md for the full directive.

## Acceptance Criteria

- [x] Beach detail opens with a full-bleed photo hero (min(60vh, 560px)) with name, municipality and tags over a scrim; beaches without photos keep a styled fallback — evidence: beach-hero.tsx min-h-[min(60vh,560px)] with scrim, name, municipality, tags; gradient fallback seen on /playas/playa-los-nietos
- [x] Gallery shows a 1 large + 2 stacked mosaic with a "Ver las N fotos" button overlaid — evidence: BeachGallery in src/routes/playas/$slug.tsx renders 1 large + 2 stacked with 'Ver las 4 fotos' button on /playas/playa-de-la-concha
- [x] Description renders as an unboxed 18px/1.6 lead paragraph — evidence: beach-rich-text.tsx lead variant text-lg leading-[1.6], unboxed above the fold
- [x] Información práctica values use neutral text; occupancy shown as a 3-step meter in ocean tones (no red) — evidence: practical-info-card.tsx values text-gray-900; OccupancyMeter uses ocean-500/ocean-100 dots, no red
- [x] Playas cercanas is not clipped without affordance (full-width row or prev/next + edge fade) — evidence: nearby-carousel.tsx edge fade mask (+ pr-12) signals overflow; seen on desktop
- [x] "Agua" temperature in weather widget no longer uses link color — evidence: weather-widget.tsx Agua row uses text-gray-700, no link color
- [x] Sidebar is sticky (top ~80px) on desktop — evidence: $slug.tsx sidebar has lg:sticky lg:top-20
- [x] Visual check on /playas/playa-de-la-concha and a photo-less beach, desktop + mobile — evidence: Playwright full-page desktop + mobile of /playas/playa-de-la-concha and /playas/playa-los-nietos (photo-less)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, pnpm test, pnpm check exit 0 (2026-10-19)

## Notes

## Learnings

- LRN-016: Fresh agent worktrees lack gitignored runtime files
## Progress Log

- [2026-10-18] Created
- [2026-10-19] Started
- [2026-10-19] Started implementation
- [2026-10-19] Completed