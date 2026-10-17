---
id: TSK-034
title: Beach Detail Layout and Hierarchy Fixes
status: complete
priority: P1
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
started: 2026-03-28
completed: 2026-03-28
---

# Beach Detail Layout and Hierarchy Fixes

## Description

As a visitor viewing a beach detail page, I want consistent visual structure so I can scan and find information easily.

## Acceptance Criteria

- [x] Standardize all main-content `<h2>` headings to `text-xl font-semibold` (reduce "Sobre esta playa" from `text-2xl` to `text-xl`)
- [x] Wrap Services and Activities grid sections in the same card container (`rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm`) used by other sections
- [x] Fix gallery thumbnail fade edges: either change gradient from `from-white` to a visible color, or remove entirely
- [x] Move certifications section below the photo gallery (out of the header area)
- [x] Add municipality to breadcrumb: "Inicio / {municipality} / {beach name}"
- [x] Add explicit width/height to map static image to prevent CLS

## Context

UI review (2026-03-28) found heading inconsistencies, missing card containers, and invisible UI elements. See `.backlog/reports/complete/RPT-004-beach-detail-playasslug-ui-review.md` for full directive.

## Notes

- Sidebar sticky `top-20` offset should also be verified against actual navbar height
- See `.backlog/reports/complete/RPT-004-beach-detail-playasslug-ui-review.md` for detailed fix instructions per item

## Learnings

## Progress Log

- [2026-03-28] Started task
- [2026-03-28] Task completed
- [2026-10-17] Migrated from legacy backlog/ (originally task #034)
