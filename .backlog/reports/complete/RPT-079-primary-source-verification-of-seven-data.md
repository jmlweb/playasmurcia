---
id: RPT-079
title: Primary-source verification of seven data leads (TSK-152)
type: finding
severity: low
status: triaged
created: 2026-11-08
triaged: 2026-11-08
task-id: TSK-185
---

## Summary

Seven leads from the 2026-11-04 data analysis were checked against primary sources on 2026-11-08 (TSK-152). Verdicts: 4 confirmed, 2 partially confirmed, 1 unresolved.

## Findings

1. **Fiesta categories: confirmed.** ITREM official lists (updated September 2026) linked from https://www.itrem.es/itrem/fiestas_interes_turistico/ (Internacional DOCUMENTOS_4_1896.pdf, Nacional _1897.pdf, Regional _1899.pdf); BOE titles verified. Coastal: Internacional = Cartagena Semana Santa (BOE-A-2005-21086), La Unión Cante de las Minas (BOE-A-2006-20641), Lorca Semana Santa (BOE-A-2007-4443), Águilas Carnaval (BOE-A-2015-1086), Cartagena Carthagineses y Romanos (BOE-A-2017-7373). Nacional = San Javier Festival Internacional de Jazz (2018). Regional = Cartagena Carnavales (1993), La Unión Cristo de los Mineros (1995), Lorca San Clemente (1995), Los Alcázares Semana de la Huerta (1985) and Incursiones Berberiscas, San Javier Festival de Teatro, Música y Danza (1995), Santiago de la Ribera Romería de San Blas (2004), San Pedro del Pinatar Virgen del Carmen (1965) and Semana Santa del Mar Menor (1993). Mazarrón: none. Procedure: Decreto 200/2017 (BORM 156, 8-07-2017).
2. **GR-92: partially confirmed.** FMRM lists the GR 92 as homologated but publishes no length. The ITREM guide "El sendero de la Costa Cálida" (https://www.murciaturistica.es/webs/murciaturistica/folletos/1/PTMDOC_1_1432016.pdf) gives "casi 180 km", El Mojón to Cala Cerrada, 9 stages (14.6 / 12.3 / 37.9 / 26.9 / 31.9 / 17.4 / 10.75 / 16.7 / 11.1 km = 179.55 km, stages proposed by Natursport). The 163 km figure comes only from an unsourced San Pedro del Pinatar 2022 brochure: discard it.
3. **Cartagena–Los Nietos train: confirmed, running.** Renfe Cercanías Cartagena line 1 (metric gauge, ex-FEVE), 15 stations per the September 2025 Renfe map (https://www.renfe.com/content/dam/renfe-viajeros/cercanias/mapas/pdf/plano-cercanias-cartagena-sep2025.pdf); service restored 17-09-2026 after a weather suspension. Frequency not verifiable from Renfe HTML (JS timetable); GTFS at https://data.renfe.com/dataset/horarios-viaje-cercanias.
4. **Lifeguard season (Plan COPLA 2025): confirmed.** BORM n.º 156, 9-07-2025, anuncio 3346 (https://www.borm.es/services/anuncio/ano/2025/numero/3346/pdf?id=837407) carries the per-municipality and per-beach periods and hours (e.g. Águilas 1 Jul–31 Aug 11:30–19:30 plus June weekends and 1–15 Sept; Mazarrón main posts 10:30–20:30; San Javier 11:00–19:00 from 31 May to 30 Sept with Semana Santa). The 2026 operativo was not searched.
5. **Summer health clinics 2026: partially confirmed.** murciasalud.es blocks fetches; the SMS note of 30-06-2026 (press copy https://www.cartagenaactualidad.com/articulo/salud/asistencia-sanitaria-region-murcia-refuerza-verano-455-medicos-mas/20260630120429219870.html) lists 8 coastal SUAP, Puerto de Mazarrón night cover, Los Alcázares UME (26 Jun–18 Oct), La Manga Norte SVAE and the Veneziola summer consultorio (Mon/Wed/Thu 16:00–21:00 to 15 Sept). No per-locality consultorio list found.
6. **Monthly sea temperature normals: unresolved.** Puertos del Estado publishes no monthly climatology table for the Cabo de Palos buoy (data only through Portus/Portuscopia downloads). Alternative official source: Copernicus Marine SST_MED_SST_L4_REP_OBSERVATIONS_010_021 (https://doi.org/10.48670/moi-00173), from which monthly normals can be computed.
7. **Mar Menor conditions: confirmed (reports), no public real-time feed.** IEO-CSIC BELICH reports at https://belich.ieo.csic.es/publicaciones/ (latest June 2026, period 1 Apr–15 Jun 2026; irregular cadence). The real-time network (6 stations since Jan 2025) has no public viewer; canalmarmenor.carm.es blocks fetches; CARM open data CSVs via https://marmenor.upct.es/ stop in July 2024.

## Follow-up tasks

Created from this report: TSK-185 (fiesta badges), TSK-186 (GR-92 copy), TSK-187 (Cercanías Cartagena stations), TSK-188 (COPLA 2025 per-beach season), TSK-189 (coastal summer health points), TSK-190 (sea temperature normals from Copernicus), TSK-191 (Mar Menor latest-report card).
