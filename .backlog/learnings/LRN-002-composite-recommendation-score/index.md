---
id: LRN-002
title: Composite recommendation score
status: active
tags: [database-data]
task: TSK-039
created: 2026-10-17
---

Migrated from legacy L002.

**Date**: 2026-03-28 | **Task**: #039 Recommendation Score and "Recomendados" Sort
**Context**: A single metric (e.g. length or services) does not reflect real beach quality.
**Learning**: Combining internal signals (services 30%, accessibility 15%, blue flag 15%, length 15%, children 10%, photos 10%, shade 5%) with external ones (Google Places, OSM) yields a more reliable ranking.
**Action**: Implemented weighted composite score used in "Recomendados" sort option.