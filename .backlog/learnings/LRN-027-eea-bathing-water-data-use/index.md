---
id: LRN-027
title: EEA bathing water data: use the ArcGIS map service, not discodata SQL
status: active
tags: [data, external-source, eea]
task: TSK-133
created: 2026-10-31
---

The EEA discodata SQL endpoint (discodata.eea.europa.eu/sql) answers 403 from the Azure Application Gateway to scripted requests, even with a browser User-Agent. The ArcGIS REST service at water.discomap.eea.europa.eu/arcgis/rest/services/BathingWater works without a key: one MapServer per season (BathingWater_Dyna_WM_<year>), layer "Bathing water quality (point)" with qualityStatus (latest season), qualityStatus_minus1..10 (history), latitude/longitude and bwProfileLink. For Spain, bwProfileLink is the NÁYADE profile page of the Ministerio de Sanidad, so one query gives both the EU class and a citable national source. The service description states which season the layer holds.
