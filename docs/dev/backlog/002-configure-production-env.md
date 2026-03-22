# Task #002: Configure Production Environment Variables

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Infra
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: #001

## User Story

As a developer, I want to configure production environment variables in the hosting platform so that the deployed app connects to Turso Cloud.

## Acceptance Criteria

- [ ] TURSO_DATABASE_URL configured in hosting platform
- [ ] TURSO_AUTH_TOKEN configured in hosting platform
- [ ] Environment variables verified (test connection from production)

## Implementation Notes

Depends on hosting choice (Cloudflare Workers or Netlify):

Cloudflare:
```bash
wrangler secret put TURSO_DATABASE_URL
wrangler secret put TURSO_AUTH_TOKEN
```

Netlify:
```bash
netlify env:set TURSO_DATABASE_URL "libsql://..."
netlify env:set TURSO_AUTH_TOKEN "..."
```

## Files to Modify

- Hosting platform configuration (external)

## Dependencies

- #001 (Turso Cloud Setup)

## Progress Log

(No progress yet)

## Learnings

(None yet)
