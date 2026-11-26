---
id: LRN-055
title: Edge-cache memory fallback leaks entries between tests that share coordinates
status: active
tags: [testing, cache, weather]
task: TSK-196
created: 2026-11-26
---

The in-memory fallback in `src/lib/edge-cache.ts` is a module-level Map that is never cleared between Vitest tests. Once card weather is cached per rounded coordinate, any test whose fetch succeeds leaves entries that a later test in the same file reuses, so the later test makes fewer upstream calls than it expects. Give each test in `src/lib/open-meteo.test.ts` its own latitude/longitude range (the per-coordinate tests use lat 40-41 at lng -1.5; the chunk-failure test moved to lng -0.6).
