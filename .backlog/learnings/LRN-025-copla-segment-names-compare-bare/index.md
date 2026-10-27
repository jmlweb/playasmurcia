---
id: LRN-025
title: COPLA segment names: compare bare names by equality and never use the parenthesized text as an alias
status: active
tags: [bug, beach-status, copla]
task: TSK-129
created: 2026-10-27
---

The 112 COPLA feed splits some beaches into segments: `BOLNUEVO (CENTRO)`, `PONIENTE I`, `BARNUEVO (LIMA 1)`, `COLON I (SUR) (LIMA 2)`. Site names carry a `Playa de` prefix, so the old "one name contains the other" rule never matched them.

Two traps when widening the match:

- The parenthesized text often names a *different* beach (`ISLAS MENORES (LEVANTE)`, `ISLAS MENORES (PONIENTE)`), so treating it as an alias would give Cartagena's Playa de Levante the Islas Menores flag. Drop it instead.
- Substring matching on bare names lets `pedrucho` match `PEDRUCHILLO`. Compare bare names by equality.

Keep the old direct rule first so existing matches never move, and when a beach has several segments show the most severe flag.

To check a matcher change against real data without exporting internals, stub `fetch` with a saved copy of the feed whose `<hora>` is replaced by `MUNICIPIO | PLAYA`; `getBeachStatus(...).time` then names the entry that matched.
