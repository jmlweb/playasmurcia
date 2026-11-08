---
id: TSK-149
title: Smoke-free beaches from the regional network
status: complete
priority: P4
tags: [data, external-source]
created: 2026-11-04
source: manual
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Smoke-free beaches from the regional network

## Description

The regional Red de Playas sin Humo lists 16 spaces: Mazarrón 5, Águilas 4, San Javier 3, Los Alcázares 2, San Pedro del Pinatar 1, Cartagena 1. The page does not date the list, but its count matches the total of 16 reported in May 2025.

Several entries cover only part of a beach, for example the sports area of Playa de La Concha, so record the stretch rather than a plain boolean.

Source: https://www.murciasalud.es/web/servicio-de-promocion-y-eps/playas-sin-humo-tabaquismo

## Acceptance Criteria

- [x] The 16 listed spaces matched to beach codes, with the covered stretch recorded — evidence: data/smoke-free-beaches.json: 16 codes with stretch where listed; beach-notices.test.ts counts 16 (2026-11-08)
- [x] List date confirmed, or marked as undated — evidence: Page undated (listDate: undated); 30 May 2025 press release confirms 16; page edited after 2026-03-02 (2026-11-08)
- [x] Shown on the beach page without implying fines, since enforcement depends on local ordinances — evidence: SmokeFreeNotice: recomienda no fumar, no fines; test asserts no multa/sanción (2026-11-08)
- [x] Source cited — evidence: Link to murciasalud list on the note; sourceUrl in JSON (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-08] Started
- [2026-11-08] Completed