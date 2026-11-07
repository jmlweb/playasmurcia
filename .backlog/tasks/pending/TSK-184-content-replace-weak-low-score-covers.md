---
id: TSK-184
title: Content: Replace weak low-score covers that show no beach
status: pending
priority: P4
tags: [images, content]
created: 2026-11-07
source: review/2026-11-07
depends-on: []
---

# Content: Replace weak low-score covers that show no beach

## Description

Follow-up to TSK-167. The low-score review found images that are not annotated but do not show the beach: playa-blanca-aguilas-2_g.jpg (a fishing boat, Playa de La Cañada del Negro, code 611), canas_g.jpg (satellite view, Playa de las Cañas, 584) and carmoli2_g.jpg (satellite view, Playa El Carmolí, 532). Source licensed replacements with scripts/source-wikimedia-pictures.ts (it only searches beaches without pictures, so clear pictures temporarily or extend it with a --codes flag) or drop the images so the beaches use the no-photo hero.

## Acceptance Criteria

- [ ] The three images are replaced with licensed photos or removed
- [ ] Source and licence recorded for any new photo
- [ ] node scripts/validate-beaches.js passes and production is migrated

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created