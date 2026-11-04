---
id: RPT-062
title: Family signals contradict childSafe across beaches
type: finding
severity: high
status: triaged
created: 2026-11-04
triaged: 2026-11-04
task-id: TSK-161
---

## Summary

Beach pages can promise families a beach that the same page marks as unsuitable for children.

## Details

`/playas/playa-de-el-rincon` shows the "Familiar" hero tag and a meta description ending "Ideal para familias", while Información práctica shows "Apta para niños: No". The description also says there is no lifeguard. The meta description says "tranquila", yet the copy says waves can be moderate.

## Where found

- `data/beaches.json`: `tags`, `childSafe` and `metaDescription`
- `data/tags.json`: `familiar` tag
- `src/lib/collections.ts`: `playas-familiares` collection
- `src/features/beaches/practical-info-card.tsx`: "Apta para niños"

## Evidence

Counted in `data/beaches.json` on 2026-11-05:

- 141 beaches carry the `familiar` tag, and 68 of them have `childSafe: false`.
- 34 beaches mention "familias" in `metaDescription`, and 10 of them have `childSafe: false`.

## Impact

Parents can pick an unsuitable beach, which is a trust and safety problem. `familiar` and `childSafe` may mean different things, but the UI gives visitors no way to tell.
