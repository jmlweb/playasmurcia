---
id: LRN-007
title: Per-isolate cache is ephemeral
status: active
tags: [infrastructure-deploy]
task: TSK-026
created: 2026-10-17
---

Migrated from legacy L007.

**Date**: 2026-03-28 | **Task**: #026 Edge Caching for External API Calls
**Context**: An in-memory `Map` is lost across requests on Workers because each request may hit a new isolate.
**Learning**: Use `caches.default` (Cloudflare Cache API) for durable edge caching, with a `Map` fallback for local dev where `caches` is missing.
**Action**: Implemented dual-layer caching strategy.