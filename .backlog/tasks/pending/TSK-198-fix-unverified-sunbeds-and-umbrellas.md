---
id: TSK-198
title: Fix unverified sunbeds and umbrellas services
status: pending
priority: P2
tags: [data, services, quality]
created: 2026-11-10
source: manual
depends-on: []
---

# Fix unverified sunbeds and umbrellas services

## Description

Services were extracted by scripts/extract-services.js with gemma3:4b from beach descriptions, so the model guessed. 124 of 193 beaches showed Hamacas and 78 showed Sombrillas, including small calas like La Reya (Junta de los Mares).

Data cleared in data/beaches.json: sunbeds and umbrellas now stay only where the beach text mentions them (7 and 2). Validation passes.

Remaining: commit, run the Turso production migration by hand (CI does not migrate), verify the La Reya page. Optional follow-up: source real data (municipal concession lists) for rental beaches.

## Acceptance Criteria

- [ ] data/beaches.json keeps sunbeds only where beach text mentions hamacas (7 beaches)
- [ ] data/beaches.json keeps umbrellas only where beach text mentions sombrillas (2 beaches)
- [ ] Prod Turso migration run by hand
- [ ] La Reya page no longer shows Hamacas
- [ ] docs/data-schema.md notes services are not verified for sunbeds and umbrellas

## Notes

## Learnings

## Progress Log

- [2026-11-10] Created