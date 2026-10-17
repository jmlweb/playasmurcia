---
id: LRN-003
title: Component modularization — hybrid, not screen-only
status: active
tags: [frontend-ui]
task: TSK-043
created: 2026-10-17
---

Migrated from legacy L003.

**Date**: 2026-03-29 | **Task**: #043 Extract Shared UI Components
**Context**: Organizing everything by "screen" duplicates what `src/routes/` already encodes and splits the listing pattern shared by explorar, municipality, and collection pages.
**Learning**: Adopted layout: `src/components/layout/` (chrome), `src/components/ui/` (generic), `src/features/listing/` (pagination, sorting, filters), `src/features/beaches/` (beach domain). Imports via `@/features/...` and `@/components/layout|ui/...`.
**Action**: Documented in `docs/architecture.md` (project structure and UI-routes flow).