---
id: LRN-033
title: Redirect map must not redirect a live slug
status: active
tags: [slugs, redirects]
task: TSK-168
created: 2026-11-04
---

## Context
With qualified slugs, `legacyNameToSlug` of beach 586 (`playa-amarilla`) differs from its current slug (`playa-amarilla-mazarron`). A naive legacy-differs-from-current rule would redirect the bare URL that beach 615 still serves.
## Insight
A redirect source must be excluded when it is a live slug. `buildSlugIndex` does this check.
## Application
When adding redirect rules, check them against the live slug set.
