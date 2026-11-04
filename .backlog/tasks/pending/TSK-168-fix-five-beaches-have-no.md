---
id: TSK-168
title: Fix: Five beaches have no reachable page because their slugs collide
status: pending
priority: P1
tags: [bug, routing, seo, data]
created: 2026-11-04
source: report/RPT-069
depends-on: []
---

# Fix: Five beaches have no reachable page because their slugs collide

## Description

Slugs are built from the beach name alone, so 5 same-name pairs share a URL and 5 beaches have no page. Links to them open a different beach, including two Águilas Blue Flag beaches (693, 596). `/sitemap.xml` lists 5 duplicate URLs.

Keep each bare slug on the beach it serves today, because that URL is indexed. Give only the other beach a municipality-qualified slug. Serving beaches: 615, 525, 564, 5907 and 633. Beaches to qualify: 586, 693, 596, 627 and 6703. Do not rename all 10.

`beachToSlug` receives a beach and is used across routes, WebMCP and cards, so check every caller. `municipality` is an index in the data, not a slug.

Also add the retired `/playas/cala-mijo.-(cueva-de-las-palomas)` URL as a 301. It cannot be derived from the current name (see LRN-018: there is no manual redirect list today).

Report: `.backlog/reports/complete/RPT-069-five-beaches-have-no-reachable.md`. Background: LRN-015, LRN-018, and the TSK-124 Parazuelos evidence.

## Acceptance Criteria

- [ ] Each of the 193 beaches resolves to its own page by slug
- [ ] The bare slugs keep serving beaches 615, 525, 564, 5907 and 633, and only 586, 693, 596, 627 and 6703 get qualified slugs
- [ ] Links from municipality, collection, nearby and explorer views open the correct beach
- [ ] sitemap.xml lists 193 unique beach URLs and canonical URLs match them
- [ ] /playas/cala-mijo.-(cueva-de-las-palomas) returns a 301 to the current slug
- [ ] A test fails if two beaches share a slug
- [ ] docs/business-rules.md replaces the Parazuelos slug note with the slug rule
- [ ] Production is checked for the five pairs after deploy
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Prefer deriving the slug from name and municipality in code, so no migration is needed. If a beaches column is added instead, migrate Turso by hand before pushing (LRN-027).