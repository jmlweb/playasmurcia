---
id: TSK-139
title: Sunrise and sunset per beach; derive puesta-sol tag
status: complete
priority: P3
tags: [data, feature]
created: 2026-10-28
source: manual
depends-on: [TSK-135]
started: 2026-11-08
completed: 2026-11-08
---

# Sunrise and sunset per beach; derive puesta-sol tag

## Description

Show sunrise and sunset times on the beach page, computed from coordinates (no external API). Make the `puesta-sol` tag factual by deriving it from `shoreBearing` (beach faces west) instead of editorial judgment.

## Acceptance Criteria

- [x] Pure sunrise/sunset function computed from coordinates, with unit tests — evidence: src/lib/sun-times.ts getSunTimes (NOAA); sun-times.test.ts within 3 min of published solstice times (2026-11-08)
- [x] Times shown on the beach page in Europe/Madrid time — evidence: SunTimesPanel in the decision rail, Europe/Madrid via formatMadridTime; Playwright on /playas/playa-lebeche (2026-11-08)
- [x] puesta-sol tag derived from shoreBearing with the rule documented in docs/business-rules.md — evidence: scripts/derive-sunset-tag.ts + validator check; rule in docs/business-rules.md Sunset Tag and Sun Times (2026-11-08)

## Notes

## Learnings

- LRN-046: Prod migration can fail mid-run and leave relations empty; always validate counts after migrating
## Progress Log

- [2026-10-28] Created
- [2026-11-08] Started
- [2026-11-08] Rule: shoreBearing within 65° of 295°. 15 beaches gained the tag, 3 lost it (526, 664, 619); 8 La Manga lagoon beaches had Mediterranean-side bearings and were set to 280°.
- [2026-11-08] Completed