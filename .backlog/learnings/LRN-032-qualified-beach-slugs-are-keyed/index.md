---
id: LRN-032
title: Qualified beach slugs are keyed by beach code, not derived from the data
status: active
tags: [slugs, routing, seo]
task: TSK-168
created: 2026-11-04
---

## Context
TSK-168. Same-name beaches in different municipalities collided on the bare slug.
## Insight
`beachToSlug` needs `code` as well as `name`, so any code that builds a beach URL from a name alone can point to the wrong beach. The qualified list lives in `MUNICIPALITY_QUALIFIED_BEACHES`. A new beach that reuses an existing name must be added there, otherwise the uniqueness test in `src/lib/slugs.test.ts` fails.
## Application
Always call `beachToSlug(beach)`, never `nameToSlug(name)`, for beach URLs.
