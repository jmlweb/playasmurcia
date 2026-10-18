const CACHE_ORIGIN = 'https://playasmurcia.cache'
const EDGE_TTL_SECONDS = 60 * 60
// Server functions carry per-call payloads and must always run
const SERVER_FN_PREFIX = '/_serverFn/'

export type HtmlCacheOptions = {
  /** Changes on every deploy so stale HTML never references purged assets. */
  versionId: string
  waitUntil: (promise: Promise<unknown>) => void
  cache: Cache
  /** Separates representations of one URL, e.g. HTML and markdown. */
  variant?: CacheVariant
}

export type CacheVariant = 'html' | 'markdown'

export function isCacheableRequest(request: Request): boolean {
  if (request.method !== 'GET') return false
  return !new URL(request.url).pathname.startsWith(SERVER_FN_PREFIX)
}

export function isCacheableResponse(response: Response): boolean {
  return (
    response.status === 200 &&
    /text\/(html|markdown)/.test(response.headers.get('content-type') ?? '')
  )
}

export function htmlCacheKey(
  request: Request,
  versionId: string,
  variant: CacheVariant = 'html',
): Request {
  const { pathname, search } = new URL(request.url)
  return new Request(
    `${CACHE_ORIGIN}/${variant}/${encodeURIComponent(versionId)}${pathname}${search}`,
  )
}

// The edge copy keeps its own TTL; browsers must revalidate on every visit so a
// deploy is visible immediately instead of after the edge TTL.
function withClientCacheControl(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'no-cache')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function toEdgeCopy(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', `public, s-maxage=${EDGE_TTL_SECONDS}`)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/**
 * Serves fully rendered HTML from the Cloudflare Cache API, keyed by deploy
 * version. Only successful GET documents are stored; server-function calls,
 * redirects, 404s and non-HTML responses always reach `render`.
 */
export async function withHtmlCache(
  request: Request,
  options: HtmlCacheOptions,
  render: () => Promise<Response>,
): Promise<Response> {
  if (!isCacheableRequest(request)) return render()

  const key = htmlCacheKey(request, options.versionId, options.variant)
  const hit = await options.cache.match(key)
  if (hit) return withClientCacheControl(hit)

  const response = await render()
  if (!isCacheableResponse(response)) return response

  options.waitUntil(options.cache.put(key, toEdgeCopy(response.clone())))
  return withClientCacheControl(response)
}
