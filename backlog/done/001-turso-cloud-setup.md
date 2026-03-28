# Task #001: Turso Cloud Setup

## Metadata
- **Status**: completed
- **Priority**: P1 - Active
- **Completed**: 2026-03-26
- **Slice**: Infra
- **Created**: 2026-03-22
- **Started**: 2026-03-25
- **Blocked by**: -

## User Story

As a developer, I want to set up the production database in Turso Cloud so that the site can serve data from a hosted database instead of local SQLite.

## Acceptance Criteria

- [x] Turso CLI installed and authenticated
- [x] Database `playasmurcia` created in Turso Cloud
- [x] Database URL and auth token obtained
- [x] Production migration script run successfully against Turso
- [x] Data validated in Turso (194 beaches, 9 municipalities, 2 seas)

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

- [2026-03-25] Started task
- [2026-03-26] Turso CLI installed at ~/.turso/turso (v1.0.18), authenticated as jmlweb
- [2026-03-26] Database created: playasmurcia at aws-eu-west-1
- [2026-03-26] URL: libsql://playasmurcia-jmlweb.aws-eu-west-1.turso.io
- [2026-03-26] Schema pushed with drizzle-kit push (--dialect turso)
- [2026-03-26] Migration completed: 194 beaches, 9 municipalities, 2 seas, 691 service + 877 activity + 749 tag relationships
- [2026-03-26] Env vars saved to .env
- [2026-03-26] Task completed

## Learnings

(None yet)
