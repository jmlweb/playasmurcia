---
id: TSK-150
title: Marinas and Cabo de Palos-Islas Hormigas marine reserve
status: pending
priority: P4
tags: [data, external-source, geo]
created: 2026-11-04
source: manual
depends-on: [TSK-146]
---

# Marinas and Cabo de Palos-Islas Hormigas marine reserve

## Description

ITREM's sitemap lists 22 `puerto_deportivo` entries. Some are not marinas, such as the Autoridad Portuaria de Cartagena and the CAR Infanta Cristina, so filter them.

The Cabo de Palos-Islas Hormigas marine reserve covers 1,931 ha. Diving needs authorization, and it is not authorizable in the integral reserve. Inner waters fall under the regional government (procedure 1153) and outer waters under the national ministry. Depends on TSK-146 because the reserve fits best at zone level.

Sources: https://www.mapa.gob.es/es/pesca/temas/proteccion-recursos-pesqueros/reservas-marinas-de-espana/cabo-de-palos-islas-hormigas/caracteristicas and https://sede.carm.es/web/procedimiento/1153

## Acceptance Criteria

- [ ] ITREM 22 entries filtered down to real marinas
- [ ] Nearest marina computed per beach, or marinas shown per zone
- [ ] Reserve shown for the affected zone, with area and the diving authorization rule
- [ ] Sources cited

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created