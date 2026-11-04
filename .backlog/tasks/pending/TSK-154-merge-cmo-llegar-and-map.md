---
id: TSK-154
title: Merge Cómo llegar and map into one section
status: pending
priority: P3
tags: [ui, beach-detail, map]
created: 2026-11-04
source: manual
depends-on: [TSK-153]
---

# Merge Cómo llegar and map into one section

## Description

"Cómo llegar" is split across two places. A text section sits above "Ubicación", and the directions button sits in the map footer under a different heading. Merge them into one section. See `src/features/beaches/location-map.tsx` and `src/routes/playas/$slug.tsx`.

## Acceptance Criteria

- [ ] Access text, map and directions button sit in one section with one heading
- [ ] No beach page shows two separate Cómo llegar elements for the same purpose
- [ ] Beaches without access text still render the map section correctly
- [ ] Layout verified at 375px and 1280px with scripts/screenshot.ts
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-153: both reorder sections in src/routes/playas/$slug.tsx and move the directions link.