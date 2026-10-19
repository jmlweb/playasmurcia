---
id: LRN-015
title: Beach slugs are not globally unique
status: active
tags: [slugs, data, routing]
task: TSK-123
created: 2026-10-19
---

## Context
Found while writing a slug uniqueness test.
## Insight
5 slugs collide: `playa-amarilla`, `playa-de-levante`, `playa-de-poniente`, `playa-larga`, `playa-parazuelos`. Same-name beaches in different municipalities share a slug and the slug map keeps the last row. Predates TSK-123.
## Application
Do not rely on slug uniqueness. Fixing it needs municipality-qualified slugs; consider a follow-up task.
