const CACHE_ORIGIN = 'https://playasmurcia.cache'

/**
 * Durable edge cache using Cloudflare Cache API with in-memory Map fallback.
 *
 * On Cloudflare Workers, `caches.default` persists across isolate restarts
 * within the same edge location. In local dev (Vite), `caches` is undefined
 * so we fall back to a module-level Map.
 */

const memoryCache = new Map<string, { data: string; expiresAt: number }>()

function cacheKey(namespace: string, key: string): string {
  return `${CACHE_ORIGIN}/${namespace}/${encodeURIComponent(key)}`
}

function isEdgeCacheAvailable(): boolean {
  return typeof caches !== 'undefined' && caches.default !== undefined
}

export async function edgeCacheGet<T>(
  namespace: string,
  key: string,
): Promise<T | undefined> {
  const url = cacheKey(namespace, key)

  if (isEdgeCacheAvailable()) {
    const response = await caches.default.match(new Request(url))
    if (!response) return undefined
    return response.json() as Promise<T>
  }

  const entry = memoryCache.get(url)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(url)
    return undefined
  }
  return JSON.parse(entry.data) as T
}

export async function edgeCacheSet<T>(
  namespace: string,
  key: string,
  data: T,
  ttlSeconds: number,
): Promise<void> {
  const url = cacheKey(namespace, key)
  const body = JSON.stringify(data)

  if (isEdgeCacheAvailable()) {
    const response = new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${ttlSeconds}`,
      },
    })
    await caches.default.put(new Request(url), response)
    return
  }

  memoryCache.set(url, {
    data: body,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })
}
