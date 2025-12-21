# Service: AEMET Weather Widget

## Description

Implement real-time weather prediction widget using AEMET OpenData API.

## Details

- **API**: `GET /api/prediccion/especifica/playa/{aemetId}`
- **Auth**: Requires API key (free registration at https://opendata.aemet.es)
- **Data**: Cloud conditions, precipitation, wind, UV index
- **Cache**: 30 minutes

## Implementation Notes

- Beaches already have `aemetId` field (65 beaches)
- Weather data is ephemeral - display only, do not store
- Handle API rate limits and errors gracefully

## Source

Extracted from `docs/CREATE_SERVICES.md`
