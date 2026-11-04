---
id: TSK-160
title: Sync UI guidelines with the beach detail hero
status: pending
priority: P4
tags: [docs, design-system]
created: 2026-11-04
source: manual
depends-on: []
---

# Sync UI guidelines with the beach detail hero

## Description

`docs/ui-guidelines.md` no longer matches beach detail. Line 199 says beach detail has no hero. The H1 renders at 48px, above the `sm:text-4xl` detail tier. Line 172 reads as applying duotone to all photo heroes, but `BeachHero` keeps natural colour, which helps visitors judge a beach. Exempt beach detail from duotone.

## Acceptance Criteria

- [ ] docs/ui-guidelines.md no longer says beach detail has no hero
- [ ] The beach detail H1 size is documented and matches the code, or the code is changed to match
- [ ] Beach detail is documented as exempt from the duotone treatment
- [ ] Breadcrumb guidance matches the current hero placement

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created