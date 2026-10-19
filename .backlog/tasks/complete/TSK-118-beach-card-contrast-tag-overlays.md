---
id: TSK-118
title: Beach card contrast, tag overlays and photo-less fallback
status: complete
priority: P2
tags: [styling, frontend, a11y]
created: 2026-10-18
source: RPT-047
depends-on: []
started: 2026-10-19
completed: 2026-10-19
---

# Beach card contrast, tag overlays and photo-less fallback

## Description

### Description

The metadata line on every beach card fails WCAG AA (gray-400 on white = 2.6:1). Up to three tag pills plus the weather chip crowd each photo and wrap on narrow columns. Cards for beaches without photos look like a broken image.

See .backlog/reports/complete/RPT-047-ui-review-2026-10-19-cross-cutting-findings.md (Critical: card metadata; Important: tag pills) and .backlog/reports/complete/RPT-050-ui-review-2026-10-19-listing-pages.md (/municipios/$slug placeholder) for the full directives.

## Acceptance Criteria

- [x] Card metadata line (beach-card.tsx:164) uses gray-600 at 13px or gray-500 at >= 14px; contrast >= 4.5:1 on white — evidence: src/features/beaches/beach-card.tsx:158-166 uses text-gray-600 (>= 4.5:1 on white); beach-card.test asserts it
- [x] At most 2 tag pills overlay the photo, or tags move into the card body as 12px outline chips; no pill wrapping to a second row at any grid width — evidence: overlayTags capped at 2 (slice(0,2)) in a flex-nowrap row, extras go to body outline chips; no wrapping in Playwright desktop + mobile shots
- [x] Photo-less fallback uses an ocean-700 to ocean-900 gradient with a clearly intentional icon/initial (no light grey placeholder) — evidence: fallback is bg-linear-to-br from-ocean-700 to-ocean-900 with wave icon; seen on Playa Los Nietos
- [x] beach-card tests updated — evidence: beach-card.test.tsx: 10 tests pass (tag cap, gray-600, gradient fallback)
- [x] Visual check on /explorar and /municipios/cartagena page 1 (Playa Los Nietos), desktop + mobile — evidence: Playwright full-page screenshots desktop + mobile of /explorar and /municipios/cartagena (2026-10-19)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, pnpm test, pnpm check exit 0 (2026-10-19)

## Notes

## Learnings

- LRN-017: Worktree agents cannot run git through the rtk hook
## Progress Log

- [2026-10-18] Created
- [2026-10-19] Started
- [2026-10-19] Started implementation
- [2026-10-19] Completed