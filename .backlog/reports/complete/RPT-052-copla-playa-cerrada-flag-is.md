---
id: RPT-052
title: COPLA 'PLAYA CERRADA' flag is mapped to 'Sin bandera'
type: bug
severity: high
status: triaged
created: 2026-10-21
triaged: 2026-10-21
task-id: TSK-125
---

- **Found**: 2026-10-21, against the live COPLA (112 Región de Murcia) feed
- **Area**: `src/lib/beach-status-112.ts`

## Observed

`toBeachFlag` (`src/lib/beach-status-112.ts:133-138`) only accepts the values in `VALID_FLAGS` (`src/lib/beach-status-112.ts:119-124`): `VERDE`, `AMARILLA`, `ROJA`, `SIN BANDERA`. Every other value falls back to `SIN BANDERA`.

The live feed fetched on 2026-10-21 contains 9 entries with `<bandera>PLAYA CERRADA</bandera>` (the other 93 are `SIN BANDERA`). Running the real `getBeachStatus` against that XML returns `flag = 'SIN BANDERA'` for, among others:

- 679 "Playa de Calarreona" (Águilas), raw `PLAYA CERRADA`
- 612 "Playa de La Colonia" (Águilas), raw `PLAYA CERRADA`

Consequences:

- The detail widget labels a closed beach "Sin bandera" (`src/features/beaches/beach-status-widget.tsx:43`).
- `getBatchBeachFlags` drops it from the listing cards, because it skips `SIN BANDERA` (`src/lib/beach-status-112.ts:228`).

Today these entries are older than `STALE_DAYS`, so the widget hides them; during the bathing season a closed beach would be shown as merely unflagged.

## Expected

A closed beach is shown as closed ("Playa cerrada"), with its own style, on both the detail widget and the cards.

## Repro

```bash
curl -s <COPLA feed URL used in src/lib/beach-status-112.ts> | grep -o '<bandera>[^<]*</bandera>' | sort | uniq -c
#   9 <bandera>PLAYA CERRADA</bandera>
#  93 <bandera>SIN BANDERA</bandera>
```

Then call `getBeachStatus('679')` with that XML: `flag` is `'SIN BANDERA'`.

## Suggested fix

Add `'PLAYA CERRADA'` to `BeachFlag` and `VALID_FLAGS`, give it a label and colour in `beach-status-widget.tsx`, and keep it in `getBatchBeachFlags`. Add a unit test with a `PLAYA CERRADA` fixture.

## Impact

Safety information is lost: users see "Sin bandera" for a beach the authorities closed.
