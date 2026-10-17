---
id: LRN-009
title: Diagnose before changing code
status: active
tags: [general]
task: 
created: 2026-10-17
---

Migrated from legacy L009.

**Date**: 2026-03-27 | **Task**: (Debug session)
**Context**: DB connection failures (expired token, schema drift, wrong URL) led to 5+ unnecessary code edits.
**Learning**: First isolate the category: auth (401)? schema (missing column)? runtime (URL scheme)? The fix is usually regenerating the token or syncing the schema, not arbitrary code changes.
**Action**: Documented as a core workflow principle. See also memory: `feedback_diagnose_before_fixing.md`.