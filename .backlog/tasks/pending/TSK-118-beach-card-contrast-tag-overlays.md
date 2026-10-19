---
id: TSK-118
title: Beach card contrast, tag overlays and photo-less fallback
status: pending
priority: P2
tags: [styling, frontend, a11y]
created: 2026-10-18
source: RPT-047
depends-on: []
---

# Beach card contrast, tag overlays and photo-less fallback

## Description

### Description

The metadata line on every beach card fails WCAG AA (gray-400 on white = 2.6:1). Up to three tag pills plus the weather chip crowd each photo and wrap on narrow columns. Cards for beaches without photos look like a broken image.

See .backlog/reports/complete/RPT-047-ui-review-2026-10-19-cross-cutting-findings.md (Critical: card metadata; Important: tag pills) and .backlog/reports/complete/RPT-050-ui-review-2026-10-19-listing-pages.md (/municipios/$slug placeholder) for the full directives.

## Acceptance Criteria

- [ ] Card metadata line (beach-card.tsx:164) uses gray-600 at 13px or gray-500 at >= 14px; contrast >= 4.5:1 on white
- [ ] At most 2 tag pills overlay the photo, or tags move into the card body as 12px outline chips; no pill wrapping to a second row at any grid width
- [ ] Photo-less fallback uses an ocean-700 to ocean-900 gradient with a clearly intentional icon/initial (no light grey placeholder)
- [ ] beach-card tests updated
- [ ] Visual check on /explorar and /municipios/cartagena page 1 (Playa Los Nietos), desktop + mobile
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-10-18] Created