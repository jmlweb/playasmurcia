---
id: LRN-006
title: workerd is not Node
status: active
tags: [infrastructure-deploy]
task: TSK-001
created: 2026-10-17
---

Migrated from legacy L006.

**Date**: 2026-03-27 | **Task**: #001/#003 Turso Cloud Setup / Deploy to Production
**Context**: The Cloudflare Vite plugin runs SSR on workerd, not Node.
**Learning**: `@libsql/client` resolves to the web client and only supports remote URLs (`libsql:`, `https:`, `http:`). `file:./local.db` yields `URL_SCHEME_NOT_SUPPORTED`. For local dev use `turso dev --db-file local.db --port 8181`.
**Action**: Configured separate local (turso dev) and production (libsql: remote) database connections.