---
id: LRN-018
title: Same-name beaches share a slug, so deleting a duplicate is URL-safe
status: active
tags: [slugs, data, routing]
task: TSK-124
created: 2026-10-19
---

## Context
TSK-124 asked to remove Playa Larga 515 and 301-redirect its slug, assuming distinct URLs.
## Insight
`nameToSlug` is name-only and the slug map keeps the last DB row, so 627, 515 and 5907 all map to `playa-larga`. Removing a same-name duplicate changes no URL. Redirects are derived at runtime only from punctuation-stripped (legacy) slugs; there is no manual redirect list.
## Application
Before adding a redirect for a deleted or renamed beach, compare `nameToSlug` of old and new names. Same-name beaches in different municipalities still need municipality-qualified slugs (see LRN-015).
