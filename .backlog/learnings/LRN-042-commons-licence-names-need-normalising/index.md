---
id: LRN-042
title: Commons licence names need normalising
status: active
tags: [wikimedia, licence, scripts]
task: TSK-142
created: 2026-11-07
---

## Context
Commons LicenseShortName comes back as "CC BY-SA 4.0" or "CC BY-SA 3.0 es", with spaces and sometimes a country suffix.
## Insight
The old code did substring matching against hyphenated slugs, so geosearch candidates were silently dropped. Only candidates with an empty licence passed.
## Application
Use isAcceptedLicense() in source-wikimedia-pictures.ts and never accept an empty licence.
