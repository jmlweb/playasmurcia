---
id: TSK-121
title: Beach detail: photo hero and gallery mosaic, calmer practical info
status: active
priority: P2
tags: [styling, frontend, beach-detail]
created: 2026-10-18
source: RPT-049
depends-on: []
started: 2026-10-19
---

# Beach detail: photo hero and gallery mosaic, calmer practical info

## Description

### Description

The most important page has no photo at the top. It opens with a flat teal band and shows photos as small tiles further down. Practical info overuses semantic colors (red for "Alta" occupancy), and the nearby carousel is clipped.

See .backlog/reports/complete/RPT-049-ui-review-2026-10-19-beach-detail.md for the full directive.

## Acceptance Criteria

- [ ] Beach detail opens with a full-bleed photo hero (min(60vh, 560px)) with name, municipality and tags over a scrim; beaches without photos keep a styled fallback
- [ ] Gallery shows a 1 large + 2 stacked mosaic with a "Ver las N fotos" button overlaid
- [ ] Description renders as an unboxed 18px/1.6 lead paragraph
- [ ] Información práctica values use neutral text; occupancy shown as a 3-step meter in ocean tones (no red)
- [ ] Playas cercanas is not clipped without affordance (full-width row or prev/next + edge fade)
- [ ] "Agua" temperature in weather widget no longer uses link color
- [ ] Sidebar is sticky (top ~80px) on desktop
- [ ] Visual check on /playas/playa-de-la-concha and a photo-less beach, desktop + mobile
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

- LRN-016: Fresh agent worktrees lack gitignored runtime files
## Progress Log

- [2026-10-18] Created
- [2026-10-19] Started