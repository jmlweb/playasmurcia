---
id: TSK-120
title: Homepage: curated featured grid, municipality cards, hero copy
status: pending
priority: P2
tags: [styling, frontend]
created: 2026-10-18
source: RPT-048
depends-on: []
---

# Homepage: curated featured grid, municipality cards, hero copy

## Description

### Description

The homepage's first grid shows unflattering photos (signpost, high-rises, dark backlit shots) in a flat 12-card layout. Municipality cards are text-only and misaligned. The highlights section is a generic three-features block.

See .backlog/reports/complete/RPT-048-ui-review-2026-10-19-homepage.md for the full directive.

## Acceptance Criteria

- [ ] Featured selection ranks by pictureQualityScore (or a curated slug list) and shows 6-9 beaches with daylight water/sand photos
- [ ] Featured section has hierarchy (e.g. first item as 2x2 feature card)
- [ ] Municipality cards include a representative photo, a single meta line ("N playas · N banderas azules", count-only when no flags) and a CTA pinned to the card bottom; unlabeled count badge removed
- [ ] Hero subtitle reduced to one line
- [ ] Highlights section either links to real collections with photos or is removed
- [ ] Duplicate "Ver todas las playas" top link removed (bottom button kept)
- [ ] Visual check on / desktop + mobile
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-10-18] Created