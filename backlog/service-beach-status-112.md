# Service: Beach Status Widget (112 Murcia)

## Description

Implement real-time beach status widget using 112 Murcia XML feed.

## Details

- **Endpoint**: `https://www.112rmurcia.es/copla/copla.xml`
- **Format**: XML
- **Data**: Lifeguard presence, beach conditions, safety flags, water temperature
- **Availability**: Summer only (June-September, 9:00-23:00)
- **Cache**: 15 minutes

## Implementation Notes

- Parse XML (use `xml2js` or similar)
- Match beach names to database (fuzzy matching may be needed)
- Handle seasonal unavailability gracefully

## Source

Extracted from `docs/CREATE_SERVICES.md`
