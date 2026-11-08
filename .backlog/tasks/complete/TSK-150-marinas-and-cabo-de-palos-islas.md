---
id: TSK-150
title: Marinas and Cabo de Palos-Islas Hormigas marine reserve
status: complete
priority: P4
tags: [data, external-source, geo]
created: 2026-11-04
source: manual
depends-on: [TSK-146]
started: 2026-11-08
completed: 2026-11-08
---

# Marinas and Cabo de Palos-Islas Hormigas marine reserve

## Description

ITREM's sitemap lists 22 `puerto_deportivo` entries. Some are not marinas, such as the Autoridad Portuaria de Cartagena and the CAR Infanta Cristina, so filter them.

The Cabo de Palos-Islas Hormigas marine reserve covers 1,931 ha. Diving needs authorization, and it is not authorizable in the integral reserve. Inner waters fall under the regional government (procedure 1153) and outer waters under the national ministry. Depends on TSK-146 because the reserve fits best at zone level.

Sources: https://www.mapa.gob.es/es/pesca/temas/proteccion-recursos-pesqueros/reservas-marinas-de-espana/cabo-de-palos-islas-hormigas/caracteristicas and https://sede.carm.es/web/procedimiento/1153

## Acceptance Criteria

- [x] ITREM 22 entries filtered down to real marinas — evidence: data/marinas.json: 19 marinas kept, 3 excluded with reasons (Puerto de Águilas, CAR Infanta Cristina, Autoridad Portuaria) (2026-11-08)
- [x] Nearest marina computed per beach, or marinas shown per zone — evidence: getNearestMarina in src/lib/marinas.ts; LocationMap shows name and straight-line distance (Playwright: La Colonia → Juan Montiel 1,1 km) (2026-11-08)
- [x] Reserve shown for the affected zone, with area and the diving authorization rule — evidence: MarineReserveNotice for zone cabo-de-palos: 1.931 ha, integral zone, diving rule (procedure 1153 / SGP); rendered on /playas/playa-de-levante (2026-11-08)
- [x] Sources cited — evidence: data/marine-reserves.json sources: MAPA, Orden APM/660/2017, sede CARM 1153 (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-08] Started
- [2026-11-08] May 2026 extension (168 ha) not reflected: BORM decree not found.
- [2026-11-08] Completed