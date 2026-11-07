---
id: LRN-040
title: es-ES Intl formatting drops the separator on 4-digit numbers
status: active
tags: [i18n, formatting]
task: TSK-148
created: 2026-11-07
---

## Context
Formatting populations and EUR/m2 values such as 1.952,8.
## Insight
Intl.NumberFormat('es-ES') uses min2 grouping, so 1952 renders as "1952". useGrouping 'always' is rejected by the project's TS 6 lib types.
## Application
Group thousands manually with a regex, as in src/lib/municipality-facts.ts.
