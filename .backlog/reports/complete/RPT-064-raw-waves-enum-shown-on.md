---
id: RPT-064
title: Raw waves enum shown on beach detail page
type: bug
severity: medium
status: triaged
created: 2026-11-04
triaged: 2026-11-04
task-id: TSK-163
---

## Summary

Más detalles renders the raw `waves` value `MODERADO`.

## Details

`practical-info-card.tsx:139` passes `waves` to the UI unmapped. The computed `text-transform` of the value is `none`, so the capitals come from the data. `docs/ui-guidelines.md` forbids raw schema values in the UI. The contradiction with the live forecast is already covered by TSK-137.

## Steps to Reproduce

1. Open `/playas/playa-de-el-rincon`.
2. Expand "Más detalles" in Información práctica.
3. Read the "Oleaje" value.

## Expected vs Actual

- Expected: a Spanish label such as "Moderado".
- Actual: `MODERADO`.

## Error messages/logs

None.
