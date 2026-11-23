---
id: RPT-082
title: CI never runs validate-beaches.js, so invalid beach data deploys
type: finding
severity: medium
status: triaged
created: 2026-11-23
triaged: 2026-11-23
task-id: TSK-199
---

## Summary

`scripts/validate-beaches.js` is the only guard for beach editorial data (LRN-037), but no CI step runs it. Every push to `main` deploys to production, so data the validator rejects ships as long as the Vitest suite passes, and the suite does not cover the validator's rules.

## Evidence

- `.github/workflows/ci.yml:43` (`pnpm check`), `:46` (seed test database) and `:53` (`pnpm test`) are the only checks before the deploy step. None runs the validator. `git log -S validate-beaches -- .github/workflows/` is empty: the step was never present.
- `scripts/validate-beaches.js:301` exits 1 when there are errors, so it is usable as a CI gate.
- `docs/development.md:166` and `docs/business-rules.md:15` say to run it "Before releases"; on this repo every push to `main` is a release.
- Rules only the validator enforces: `shoreBearing` required (`docs/business-rules.md:77`), sunset tag consistency (`docs/business-rules.md:89`), paired `**` and stated length in `description`, https links and no `#`/`* ` in `access` (`docs/data-schema.md:350-351`).

## Reproduction (2026-11-23, main @ 0e4a196)

```bash
node -e 'const fs=require("fs");const b=JSON.parse(fs.readFileSync("data/beaches.json"));delete b[0].shoreBearing;b[1].description+=" **sin cerrar";b[2].access+="\n\n# Heading";fs.writeFileSync("data/beaches.json",JSON.stringify(b,null,2)+"\n")'
node scripts/validate-beaches.js; echo $?   # 1
pnpm tsx scripts/migrate-to-database.ts && pnpm vitest run   # all pass
git checkout data/beaches.json
```

Observed validator output:

```
  ✗ Beach 575: shoreBearing must be an integer in [0, 359]
  ✗ Beach 601: description has an unpaired '**' marker
  ✗ Beach 516: access uses unsupported markdown ('* ' or '#')
```

Observed Vitest result with the same invalid data: `Test Files 90 passed | 1 skipped (91)`, `Tests 722 passed | 2 skipped (724)`.

On unmodified `main` the validator reports `Errors: 0`, `Warnings: 0` and needs no env vars or network, so adding it to CI cannot break the current pipeline.

## Suggested fix

Add `- run: node scripts/validate-beaches.js` to `.github/workflows/ci.yml` before the deploy step (for example next to `pnpm check`), or wrap it in a Vitest test, and update `docs/development.md` to say CI enforces it.
