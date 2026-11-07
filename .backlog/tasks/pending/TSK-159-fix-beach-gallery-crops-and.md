---
id: TSK-159
title: Fix beach gallery crops and photo count button
status: pending
priority: P4
tags: [ui, beach-detail, images]
created: 2026-11-04
source: manual
depends-on: [TSK-153]
---

# Fix beach gallery crops and photo count button

## Description

`BeachGallery` in `src/routes/playas/$slug.tsx` is now a capped mosaic that starts at photo 2. At 375px the main tile is about 223×214, so 2233×727 panoramas are still cropped heavily, and they looked soft on the 2x mobile capture. "Ver las 5 fotos" spans x 196-347 across the tile gap at 239-247 on `/playas/playa-de-el-rincon`.

## Acceptance Criteria

- [ ] Panoramic photos are no longer cropped into near-square tiles
- [ ] Images look sharp on a 2x display at 375px
- [ ] Ver las N fotos no longer straddles two tiles at 375px
- [ ] Layout verified at 375px and 1280px with scripts/screenshot.ts
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-153: both edit src/routes/playas/$slug.tsx.