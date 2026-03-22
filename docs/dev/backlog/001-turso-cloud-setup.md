# Task #001: Turso Cloud Setup

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Infra
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: -

## User Story

As a developer, I want to set up the production database in Turso Cloud so that the site can serve data from a hosted database instead of local SQLite.

## Acceptance Criteria

- [ ] Turso CLI installed and authenticated
- [ ] Database `playasmurcia` created in Turso Cloud
- [ ] Database URL and auth token obtained
- [ ] Production migration script run successfully against Turso
- [ ] Data validated in Turso (194 beaches, 9 municipalities, 2 seas)

## Implementation Notes

```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db create playasmurcia
turso db show playasmurcia --url
turso db tokens create playasmurcia
```

Then run migration:
```bash
TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." pnpm tsx scripts/migrate-to-database.ts
```

## Files to Modify

- `.env` (local credentials)
- `.env.example` (document new vars)

## Dependencies

-

## Progress Log

(No progress yet)

## Learnings

(None yet)
