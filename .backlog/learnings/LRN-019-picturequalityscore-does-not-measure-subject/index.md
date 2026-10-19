---
id: LRN-019
title: pictureQualityScore does not measure subject quality
status: active
tags: [ui, data, homepage]
task: TSK-120
created: 2026-10-19
---

## Context
The old homepage ranking put Barco Perdido (high-rises) and La Calera (signpost) first because they scored 3.
## Insight
The score reflects technical quality, not what the photo shows. Score >= 3 does not mean a flattering photo.
## Application
Use hand-picked beach codes for hero and featured slots (`src/lib/home-curation.ts`) and review a photo contact sheet by eye. Use codes, not names or slugs, so they survive renames.
