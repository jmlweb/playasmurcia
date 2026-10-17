---
id: TSK-044
title: Standardize Hero Heading Size Tiers
status: complete
priority: P3
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-28
---

# Standardize Hero Heading Size Tiers

## Description

As a visitor navigating between pages, I want a consistent visual hierarchy where index pages feel "bigger" than detail pages.

## Acceptance Criteria

- [ ] Collection detail h1: change from `text-4xl sm:text-5xl` to `text-3xl font-extrabold tracking-tight text-white sm:text-4xl`
- [ ] Verify all index pages use `text-4xl sm:text-5xl` (municipios index, colecciones index)
- [ ] Verify all detail/tool pages use `text-3xl sm:text-4xl` (municipio detail, explorer)
- [ ] Simplify collection detail hero: merge beach count badge into subtitle text, remove separate `<p>` badge element

## Context

UI review (2026-03-28) found hero h1 sizes are inconsistently applied. The collection detail uses `text-4xl sm:text-5xl` (index tier) instead of `text-3xl sm:text-4xl` (detail tier). See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` (CC-4) and `.backlog/reports/complete/RPT-006-coleccin-detail-design-directive-ui.md`.

## Notes

- Quick fix, ~15 minutes
- See `.backlog/reports/complete/RPT-006-coleccin-detail-design-directive-ui.md` for full directive

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #044)
