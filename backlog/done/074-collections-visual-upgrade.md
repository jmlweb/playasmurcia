# Task #074: Collections Visual Upgrade

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P3 - Nice
- **Slice**: Styling
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor browsing collections, I want visually rich collection cards so that I can feel the character of each collection before clicking.

## Context

UI audit (2026-03-29) flagged collection cards as text-heavy with no imagery. Sea vs thematic collections have inconsistent sizing and CTAs.

## Acceptance Criteria

- [x] Add hero image to each CollectionCard (representative photo or theme-color gradient)
- [x] Feature 3–4 "hero" collections as larger cards with images; rest in compact format
- [x] Make sea collection cards into horizontal banner-style with coastal photo background
- [x] Standardize CollectionIcon sizing (sea `h-14 w-14` vs thematic `h-10 w-10`)
- [x] Standardize CTA text (sea "Explorar" vs thematic "Ver colección" — pick one)
- [x] Add subtle `sand-100` background behind "Colecciones temáticas" block
- [x] If amber/orange bars confuse users, shift one toward a cooler hue

## Source Reports

- `reports/done/ui-audit-2026-03-29.md` — I12–I14, R8, R9
- `reports/done/colecciones-index.md` — CI1, CI2
