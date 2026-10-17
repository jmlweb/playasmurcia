---
id: LRN-001
title: 33% AEMET → 100% Open-Meteo
status: active
tags: [database-data]
task: TSK-028
created: 2026-10-17
---

Migrated from legacy L001.

**Date**: 2026-03-28 | **Task**: #028 Coordinate-Based Weather for All Beaches
**Context**: Only 65 of 194 beaches have `aemetId`, limiting weather coverage.
**Learning**: Using coordinates (lat/lng) with Open-Meteo as fallback covers 100% without an API key. AEMET remains the primary source where it exists.
**Action**: Implemented dual-source weather: AEMET by ID when available, Open-Meteo by coordinates for the rest.