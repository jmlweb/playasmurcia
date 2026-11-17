---
id: LRN-051
title: Type JSON-imported beach services as readonly number[] before includes
status: active
tags: [testing, typescript, data]
task: TSK-198
created: 2026-11-17
---

Importing data/beaches.json in a Vitest file makes TypeScript infer `services` as a union that includes `never[]` (beaches with no services), so `beach.services.includes(index)` fails tsc with "Argument of type 'number' is not assignable to parameter of type 'never'". Widen it with a typed helper (`(beach): readonly number[] => beach.services`) before calling includes. Vitest itself passes; only `pnpm check` catches it.
