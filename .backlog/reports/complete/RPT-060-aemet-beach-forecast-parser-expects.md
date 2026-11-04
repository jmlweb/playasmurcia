---
id: RPT-060
title: AEMET beach forecast parser expects an invented payload shape, so the AEMET widget never renders
type: bug
severity: medium
status: triaged
created: 2026-10-31
triaged: 2026-10-31
task-id: TSK-144
---

## Summary

`docs/business-rules.md:54` documents AEMET as the primary forecast source for the 29 beaches with an `aemetId`. The parser in `src/lib/aemet.ts` assumes a payload shape that the AEMET `prediccion/especifica/playa/{id}` endpoint does not return. Every real AEMET response makes the server function throw. The client swallows the error and silently falls back to Open-Meteo, so the AEMET forecast never shows.

## Evidence of the real payload shape

Two independent third-party parsers of the same endpoint agree:

- `javieralonsolujan-creator/playas-app` `scripts/aemet.py` (`_texto_manana_tarde`, `_valor_numerico`, `_parsear_dia`): `estadoCielo`, `viento` and `oleaje` are **objects** with `f1`/`descripcion1`/`f2`/`descripcion2`. `tMaxima`, `tAgua` and `uvMax` are objects with `valor1`. There is no `indiceUV` field.
- CRAN `climaemet` `R/aemet-forecast-beach.R`: parses `fecha` with `tryFormats = c("%Y-%m-%d", "%Y/%m/%d", "%Y%m%d")`. `fecha` is a `YYYYMMDD` value, not epoch milliseconds.

The repo fixture at `src/lib/aemet.test.ts:114-126` uses the invented shape: arrays of `{ periodo, descripcion, value }`, numeric `tMaxima`, and epoch-ms `fecha`. The tests therefore cannot catch this.

## Code path

- `src/lib/aemet.ts:113-122`: `d.estadoCielo ?? []` passes the object through unchanged. `d.tMaxima ?? -999` keeps the `{ valor1 }` object.
- `src/lib/aemet.ts:137-169`: `getDaySkyDescription`, `getDayWind` and `getDayWaves` call `.find` on that object and throw a `TypeError`.
- `src/features/beaches/weather-widget.tsx:56-93`: the `fetchAemetWeather` handler calls those helpers, so the server function rejects.
- `src/features/beaches/weather-widget.tsx:505` and `:511` (`if (!aemet) return om`): `.catch(() => null)` swallows the error and the widget shows Open-Meteo.
- `src/features/beaches/weather-widget.tsx:226-228`: even with a fixed parser, `formatDayLabel(new Date(fecha))` on `20261101` resolves to 1970-01-01, which is a Thursday for every day.

## Reproduction

Run a script outside the repo that imports the helpers and feeds them one day in the documented shape:

```ts
const day = {
  fecha: 20261101,
  estadoCielo: { value: '', f1: 100, descripcion1: 'despejado', f2: 120, descripcion2: 'poco nuboso' },
  viento: { value: '', f1: 210, descripcion1: 'flojo', f2: 220, descripcion2: 'moderado' },
  oleaje: { value: '', f1: 310, descripcion1: 'débil', f2: 310, descripcion2: 'débil' },
  tMaxima: { value: '', valor1: 22 },
}
```

Observed output (`pnpm tsx /tmp/aemet-repro.ts`):

```
getDaySkyDescription throws TypeError: estadoCielo.find is not a function
getDayWind throws TypeError: viento.find is not a function
getDayWaves throws TypeError: oleaje.find is not a function
new Date(20261101) = 1970-01-01T05:37:41.101Z getDay() = 4
```

Not verified against a live response: the run had no `AEMET_API_KEY`. Capture one real response with the production key first and commit it as the test fixture.

## Suggested fix

1. Capture a real `datos` payload for one Murcia beach (e.g. `3000301`) and use it as the fixture in `src/lib/aemet.test.ts`.
2. Map `estadoCielo`/`viento`/`oleaje` from `f1`/`descripcion1` (morning) and `f2`/`descripcion2` (afternoon). Map `tMaxima`/`tAgua`/`uvMax` from `valor1`.
3. Parse `fecha` as `YYYYMMDD` into a date before it reaches `formatDayLabel`.
4. Check the `datos` charset while capturing the fixture. AEMET is known to serve ISO-8859-15 on some endpoints, and `.json()` decodes as UTF-8, which would garble `débil`.
