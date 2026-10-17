---
id: LRN-008
title: `.env` vs `.dev.vars`
status: active
tags: [infrastructure-deploy]
task: TSK-001
created: 2026-10-17
---

Migrated from legacy L008.

**Date**: 2026-03-27 | **Task**: #001 Turso Cloud Setup
**Context**: Environment variables weren't reaching the runtime.
**Learning**: workerd does not read `.env` automatically; Cloudflare uses `.dev.vars` for secrets in local development.
**Action**: Documented the distinction; use `.dev.vars` for local secrets.