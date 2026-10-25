---
id: RPT-056
title: COPLA flag lookup misses beaches whose feed name carries a segment suffix
type: bug
severity: medium
status: triaged
created: 2026-10-25
triaged: 2026-10-25
task-id: TSK-129
---

## Description

`namesMatch` (`src/lib/beach-status-112.ts:81-85`) only matches when one normalized name contains the other. The 112 COPLA feed splits several beaches into qualified segments (`BOLNUEVO (CENTRO)`, `PONIENTE I`, `BARNUEVO (LIMA 1)`, `ISLAS MENORES (LEVANTE)`, `LA AZOHIA (CHAPINETA)`), and the site names carry a `Playa de` prefix. Neither string contains the other, so `getBeachStatus` (`:180`) and `getBatchBeachFlags` (`:215`) find no entry and the beach shows no flag at all, including red flags and closures in season.

Example: `"playa de bolnuevo"` vs `"bolnuevo centro"`; `"playa barnuevo"` vs `"barnuevo lima 1"`.

## Reproduction

Live feed `https://www.112rmurcia.es/copla/copla.xml` fetched 2026-10-25 (102 entries). Calling the real function with `pnpm tsx`:

```
Playa de Bolnuevo -> null
Playa de Poniente -> null        (Águilas)
Playa Barnuevo -> null           (San Javier)
Playa de Islas Menores -> null   (Cartagena)
Playa de Calarreona -> {"flag":"PLAYA CERRADA",...}   (control: unqualified feed name matches)
```

Running the same matching logic over `data/beaches.json`: 59 of 193 site beaches match a feed entry; 43 feed entries match no beach. Of those, these site beaches have qualified feed entries but get no flag:

- Mazarrón: 646 Playa de Bolnuevo (`BOLNUEVO (CAMPING|CENTRO|OASIS)`), 581 Playa de El Rihuete (`PUERTO - RIHUETE`, `SILLAS DE RIHUETE`)
- Águilas: 596 Playa de Poniente (`PONIENTE I/II`), 660 Playa Las Delicias (`LAS DELICIAS I/II`)
- Cartagena: 530 Playa de Islas Menores (`ISLAS MENORES (LEVANTE|PONIENTE)`), 580 Playa de La Chapineta (`LA AZOHIA (CHAPINETA)`), 525 Playa de Levante (`LEVANTE (CABO DE PALOS)`)
- Los Alcázares: 585 Playa de Las Salinas (`LAS SALINAS (ALCAZARES)`)
- San Javier (`(LIMA n)` suffix): 667 Barnuevo, 668 Colón, 671 Banco del Tabal, 536 Estacio, 561 El Arenal, 562 Ensenada del Esparto, 673 La Veneziola, 539 Lebeche, 696 Mistral, 672 Pedrucho

Feed entries with no site beach (EL CORRAL, LA CABAÑA, PUERTO VILLA SAN PEDRO, ...) are out of scope.

## Notes

Beaches with several feed segments (Bolnuevo ×3, Poniente ×2) need a deterministic rule for which flag wins, e.g. the most severe. Related: LRN-023 (closure flags), TSK-125.
