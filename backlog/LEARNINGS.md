# Learnings

Insights and discoveries made during development. Each learning is linked to the task where it was discovered.

## Database & Data

- **33% AEMET → 100% Open-Meteo** — Solo 65 de 194 playas tienen `aemetId`. Usar coordenadas (lat/lng) con Open-Meteo como fallback cubre el 100% sin necesidad de API key. AEMET sigue como fuente primaria donde existe. _(Task 028)_
- **Score de recomendación compuesto** — Una sola métrica (ej. longitud o servicios) no refleja la calidad real de una playa. Combinar datos internos (servicios 30%, accesibilidad 15%, bandera azul 15%, longitud 15%, niños 10%, fotos 10%, sombra 5%) con señales externas (Google Places, OSM) da un ranking más fiable. _(Task 039)_

## Frontend & UI

- **Secciones que no aportan, fuera** — Mares y Comparar se crearon (Tasks 015/016) y luego se eliminaron porque diluían los flujos principales (explorar, colecciones, municipios). Mejor integrar el contenido en Colecciones que crear secciones nuevas de poco valor.
- **Progressive loading > paginación clásica** — "Cargar más" con batch sizes progresivos da mejor UX que paginación numerada en listados de playas. El usuario ve resultados inmediatos y decide cuándo quiere más. _(Task 038)_

## Infrastructure & Deploy

- **workerd no es Node** — El plugin de Cloudflare Vite ejecuta SSR en workerd, no en Node. `@libsql/client` resuelve al web client y solo soporta URLs remotas (`libsql:`, `https:`, `http:`). `file:./local.db` da `URL_SCHEME_NOT_SUPPORTED`. Para dev local usar `turso dev --db-file local.db --port 8181`. _(Tasks 001, 003)_
- **Cache per-isolate es efímero** — Un `Map` en memoria se pierde entre requests en Workers porque cada request puede caer en un isolate nuevo. Hay que usar `caches.default` (Cache API de Cloudflare) para cache durable en el edge, con fallback a Map para dev local donde `caches` no existe. _(Task 026)_
- **`.env` vs `.dev.vars`** — workerd no lee `.env` automáticamente; Cloudflare usa `.dev.vars` para secrets en desarrollo local. Si las env vars no llegan al runtime, comprobar esto primero. _(Task 001)_

## SEO & Performance

(No learnings yet)

## General

- **Diagnosticar antes de tocar código** — Errores de conexión a DB (token expirado, schema drift, URL incorrecta) no se resuelven cambiando imports en `client.ts` o configuración de `vite.config.ts`. Primero aislar: ¿es auth (401)? ¿schema (columna missing)? ¿runtime (URL scheme)? La solución suele ser regenerar token o sincronizar schema, no cambiar código. _(Descubierto tras 5+ cambios innecesarios en una sesión de debug)_
