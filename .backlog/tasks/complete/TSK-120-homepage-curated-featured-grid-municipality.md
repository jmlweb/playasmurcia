---
id: TSK-120
title: Homepage: curated featured grid, municipality cards, hero copy
status: complete
priority: P2
tags: [styling, frontend]
created: 2026-10-18
source: RPT-048
depends-on: []
started: 2026-10-19
completed: 2026-10-19
---

# Homepage: curated featured grid, municipality cards, hero copy

## Description

### Description

The homepage's first grid shows unflattering photos (signpost, high-rises, dark backlit shots) in a flat 12-card layout. Municipality cards are text-only and misaligned. The highlights section is a generic three-features block.

See .backlog/reports/complete/RPT-048-ui-review-2026-10-19-homepage.md for the full directive.

## Acceptance Criteria

- [x] Featured selection ranks by pictureQualityScore (or a curated slug list) and shows 6-9 beaches with daylight water/sand photos — evidence: src/lib/home-curation.ts FEATURED_BEACH_CODES (6 beaches); / shows 6 daylight water/sand photos (2026-10-19)
- [x] Featured section has hierarchy (e.g. first item as 2x2 feature card) — evidence: manual: El Rincón renders as 2x2 feature card on / desktop (2026-10-19)
- [x] Municipality cards include a representative photo, a single meta line ("N playas · N banderas azules", count-only when no flags) and a CTA pinned to the card bottom; unlabeled count badge removed — evidence: manual: / shows photo, 'N playas · N banderas azules' (count-only for Los Alcázares/La Unión), CTA at card bottom, no count badge (2026-10-19)
- [x] Hero subtitle reduced to one line — evidence: manual: hero subtitle is one line on / desktop (2026-10-19)
- [x] Highlights section either links to real collections with photos or is removed — evidence: highlights-section.tsx deleted; grep finds no references (2026-10-19)
- [x] Duplicate "Ver todas las playas" top link removed (bottom button kept) — evidence: manual: only the bottom 'Ver las 194 playas' button remains in the featured section (2026-10-19)
- [x] Visual check on / desktop + mobile — evidence: manual: scrolled Playwright screenshots of / at 1280px and 390px reviewed (2026-10-19) (2026-10-19)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build → exit 0; pnpm test → 338 passed; pnpm check → exit 0 (2026-10-19)

## Notes

## Learnings

- LRN-019: pictureQualityScore does not measure subject quality
- LRN-020: Fresh worktree needs local DB and generated route tree before build/check
## Progress Log

- [2026-10-18] Created
- [2026-10-19] Started
- [2026-10-19] Completed