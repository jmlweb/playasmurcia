---
id: LRN-029
title: Local scripts inherit NODE_ENV=production from the hustle shell
status: active
tags: [tooling, database]
task: TSK-133
created: 2026-10-31
---

On the hustle machine NODE_ENV=production is set in the shell. scripts/migrate-to-database.ts then targets TURSO_DATABASE_URL (undefined locally) and fails with "URL_INVALID: The URL 'undefined'", even with DATABASE_URL=file:./local.db. Prefix local seeding and tests with NODE_ENV=development. Also, src/lib/sitemap-routes.test.ts reads public/sitemap.xml, which only exists after pnpm build, so run the build before the test suite (as CI does).
