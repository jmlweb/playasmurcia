---
id: TSK-184
title: Content: Replace weak low-score covers that show no beach
status: complete
priority: P4
tags: [images, content]
created: 2026-11-07
source: review/2026-11-07
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Content: Replace weak low-score covers that show no beach

## Description

Follow-up to TSK-167. The low-score review found images that are not annotated but do not show the beach: playa-blanca-aguilas-2_g.jpg (a fishing boat, Playa de La Cañada del Negro, code 611), canas_g.jpg (satellite view, Playa de las Cañas, 584) and carmoli2_g.jpg (satellite view, Playa El Carmolí, 532). Source licensed replacements with scripts/source-wikimedia-pictures.ts (it only searches beaches without pictures, so clear pictures temporarily or extend it with a --codes flag) or drop the images so the beaches use the no-photo hero.

## Acceptance Criteria

- [x] The three images are replaced with licensed photos or removed — evidence: 584 Las Cañas: canas_g.jpg replaced by wm-geo-584.jpg (dune path to the beach, Calblanque); 611: boat photo removed, playa-blanca-aguilas_g.jpg stays as cover; 532 El Carmolí: no candidate showed the beach, pictures removed (no-photo hero) (2026-11-08)
- [x] Source and licence recorded for any new photo — evidence: data/picture-credits.json wm-geo-584.jpg: Julia Roca, CC BY-SA 4.0, Wikimedia Commons (2026-11-08)
- [x] node scripts/validate-beaches.js passes and production is migrated — evidence: validate-beaches.js 0 errors; score:picture-quality rerun (2 changes); R2 synced (9 up, 27 deleted); prod migrated and validate-migration 18/18 (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created
- [2026-11-08] Started
- [2026-11-08] Added --codes to scripts/source-wikimedia-pictures.ts. Fixed the docs example: pnpm sync:pictures --dry-run (no --).
- [2026-11-08] Completed