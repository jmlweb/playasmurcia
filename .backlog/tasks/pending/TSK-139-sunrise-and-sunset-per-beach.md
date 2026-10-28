---
id: TSK-139
title: Sunrise and sunset per beach; derive puesta-sol tag
status: pending
priority: P3
tags: [data, feature]
created: 2026-10-28
source: manual
depends-on: [TSK-135]
---

# Sunrise and sunset per beach; derive puesta-sol tag

## Description

Show sunrise and sunset times on the beach page, computed from coordinates (no external API). Make the `puesta-sol` tag factual by deriving it from `shoreBearing` (beach faces west) instead of editorial judgment.

## Acceptance Criteria

- [ ] Pure sunrise/sunset function computed from coordinates, with unit tests
- [ ] Times shown on the beach page in Europe/Madrid time
- [ ] puesta-sol tag derived from shoreBearing with the rule documented in docs/business-rules.md

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created