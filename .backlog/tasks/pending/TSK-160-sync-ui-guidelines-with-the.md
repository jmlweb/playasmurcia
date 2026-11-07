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

`docs/ui-guidelines.md` no longer matches beach detail, although its hero height table (line 165) is current. Line 199 says beach detail has no hero. The H1 renders at `sm:text-5xl` (48px), above the `sm:text-4xl` detail tier on line 186. Line 172 reads as applying duotone to all photo heroes, but `BeachHero` keeps natural colour, which helps visitors judge a beach. Exempt beach detail from duotone.

TSK-157 recorded the side-rail decision in DESIGN.md (flat panels with no shadow), but line 86 still reads as if every static section is unboxed. Add the rail panels there.

## Acceptance Criteria

- [ ] docs/ui-guidelines.md no longer says beach detail has no hero
- [ ] The beach detail H1 size is documented and matches the code, or the code is changed to match
- [ ] Beach detail is documented as exempt from the duotone treatment
- [ ] Breadcrumb guidance matches the current hero placement
- [ ] docs/ui-guidelines.md documents the flat beach side-rail panels

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-157, which also updates docs/ui-guidelines.md.
- [2026-11-07] Removed TSK-157 dependency: TSK-157 is complete. Took over its ui-guidelines criterion.