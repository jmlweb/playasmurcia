---
id: LRN-037
title: Beach editorial fields are one-off LLM output; the validator is the only guard
status: active
tags: [data, validation, content]
task: TSK-161
created: 2026-11-05
---

## Context
The AGENTS.md ban on hand-editing generated fields suggests a script owns `tags`, `childSafe` and `metaDescription`.
## Insight
No script regenerates them. They are one-off Ollama/Gemma output stored in `data/beaches.json`, and `scripts/enrich-with-gemma4.ts` only reports inconsistencies. Cross-field contradictions persist unless `scripts/validate-beaches.js` rejects them.
## Application
When a new contradiction class appears, fix the JSON directly and add a cross-field rule to `scripts/validate-beaches.js`. A round-trip through `JSON.stringify(x, null, 2)` leaves `data/beaches.json` byte-identical, so a Node script can edit it without formatting noise.
