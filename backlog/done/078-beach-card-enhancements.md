# Task #078: BeachCard Visual Enhancements

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P3 - Nice
- **Slice**: Styling
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor browsing beach listings, I want more cinematic cards with useful at-a-glance info so that I can evaluate beaches without clicking into each one.

## Context

UI audit (2026-03-29) identified BeachCard as slightly cramped with no secondary info beyond the name and location.

## Acceptance Criteria

- [x] Change aspect ratio from `aspect-[4/3]` to `aspect-[3/2]` for cinematic feel
- [x] Increase internal padding from `p-5` to `p-6`
- [x] Strengthen gradient overlay `from-black/30 to-transparent` for better tag contrast
- [x] Add 1 line of secondary info (length or soil type as `text-xs text-gray-400 truncate`)
- [x] Increase weather badge from `px-2 py-0.5 text-xs` to `px-2.5 py-1 text-sm bg-white/90`
- [x] Ensure explicit `aspect-*` or `min-height` on image wrapper for CLS prevention

## Source Reports

- `reports/done/ui-audit-2026-03-29.md` — BC1–BC3, I10, I11
- `reports/done/homepage.md` — HP5
- `reports/done/home.md` — HM1
