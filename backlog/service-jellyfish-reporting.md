# Service: Real-Time Jellyfish Reporting

## Description

User-generated jellyfish alerts with automatic expiration.

## Details

- **Storage**: Redis or in-memory with TTL (4 hours)
- **Endpoints**:
  - `POST /api/jellyfish/report` - Submit report
  - `GET /api/jellyfish/reports?beachCode=xxx` - Get current reports
- **Data**: beachCode, severity (few/moderate/many), timestamp

## Implementation Notes

- Validate beach codes against beaches.json
- Rate limit: 1 report per user per beach per hour
- Display aggregated counts on beach pages
- Complements static `jellyfishRisk` field (historical risk)

## Source

Extracted from `docs/CREATE_SERVICES.md`
