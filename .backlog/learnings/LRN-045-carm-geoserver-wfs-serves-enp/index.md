---
id: LRN-045
title: CARM GeoServer WFS serves ENP, LIC-ZEC and ZEPA limits as GeoJSON
status: active
tags: [data, external-source, geo]
task: TSK-140
created: 2026-11-08
---

The regional protected-space and Natura 2000 limits for Murcia are on the CARM (IDERM) GeoServer at `https://mapas-gis-inter.carm.es/geoserver/wfs`, layers `SIG_LUP_SITES_CARM:ENP` (29 features), `SIG_LUP_SITES_CARM:LIC-ZEC` (50) and `SIG_LUP_SITES_CARM:ZEPA` (26). `GetFeature` with `outputFormat=application/json&srsName=EPSG:4326` returns `[lng, lat]` positions. The layers have no version or date field and the CSW catalogue does not list them, so record the retrieval date, the feature count and the abstract from `GetCapabilities` instead.

Traps:
- The ENP layer also holds `figura = "Resto Ámbito PORN"` polygons: the planning extent around a park, not the protected space itself. Drop them.
- Some ENP have more than one feature per `codigoenp`. Dedupe by code and designation, not code alone: ES0000175 (San Pedro salt flats) is both a ZEC in `LIC-ZEC` and a ZEPA in `ZEPA` with the same code.
- The MITECO Natura 2000 WMS (`wms.mapama.gob.es/sig/Biodiversidad/RedNatura`) timed out; the EEA ArcGIS service (`bio.discomap.eea.europa.eu/.../Natura2000Sites/MapServer`, release 2024) answers point queries and has the same site codes.
