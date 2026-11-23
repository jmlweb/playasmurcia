import {
  validateListingSearch,
  validateMunicipalitySearch,
  validateSearch,
} from '@/lib/explorer-search'

const CACHE_ORIGIN = 'https://playasmurcia.cache'
const EDGE_TTL_SECONDS = 60 * 60
// Short enough that a page published after a 404 shows up quickly, long
// enough that repeated probes of a missing URL skip SSR and Turso
const NOT_FOUND_EDGE_TTL_SECONDS = 60
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
    (response.status === 200 || response.status === 404) &&
    /text\/(html|markdown)/.test(response.headers.get('content-type') ?? '') &&
    !(response.headers.get('cache-control') ?? '').includes('no-store')
  )
}

// Each validator returns every key it knows (unset ones as undefined), so the
// key lists stay in sync with the routes without a second hand-kept list
const searchKeysOf = (
  validate: (search: Record<string, unknown>) => object,
): ReadonlySet<string> => new Set(Object.keys(validate({})))

type RouteSearchKeys = {
  pattern: RegExp
  searchKeys: ReadonlySet<string>
}

const SEARCH_KEYS_BY_ROUTE: readonly RouteSearchKeys[] = [
  { pattern: /^\/explorar\/?$/, searchKeys: searchKeysOf(validateSearch) },
  {
    pattern: /^\/municipios\/[^/]+\/?$/,
    searchKeys: searchKeysOf(validateMunicipalitySearch),
  },
  {
    pattern: /^\/colecciones\/[^/]+\/?$/,
    searchKeys: searchKeysOf(validateListingSearch),
  },
]

const NO_SEARCH_KEYS: ReadonlySet<string> = new Set()

const searchKeysForPath = (pathname: string): ReadonlySet<string> =>
  SEARCH_KEYS_BY_ROUTE.find(({ pattern }) => pattern.test(pathname))
    ?.searchKeys ?? NO_SEARCH_KEYS

/**
 * Keeps only the parameters the route validates, sorted by name. Unknown ones
 * (fbclid, utm_*, random cache busters) render the same page, so they must not
 * create new entries. Values are only decoded and re-encoded by
 * URLSearchParams, the same parser the router uses, so `+` and `%20` share an
 * entry; they are never re-validated, which could make two different renders
 * share one entry.
 */
function normalisedSearch(url: URL): string {
  const searchKeys = searchKeysForPath(url.pathname)
  const known = new URLSearchParams(
    [...url.searchParams].filter(([name]) => searchKeys.has(name)),
  )
  known.sort()
  const search = known.toString()
  return search ? `?${search}` : ''
}

export function htmlCacheKey(
  request: Request,
  versionId: string,
  variant: CacheVariant = 'html',
): Request {
  const url = new URL(request.url)
  return new Request(
    `${CACHE_ORIGIN}/${variant}/${encodeURIComponent(versionId)}${url.pathname}${normalisedSearch(url)}`,
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
  const ttlSeconds =
    response.status === 404 ? NOT_FOUND_EDGE_TTL_SECONDS : EDGE_TTL_SECONDS
  headers.set('Cache-Control', `public, s-maxage=${ttlSeconds}`)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/**
 * Serves fully rendered HTML from the Cloudflare Cache API, keyed by deploy
 * version, path and the route's known search parameters. Successful GET
 * documents are stored for the edge TTL and 404 pages for a short TTL;
 * server-function calls, redirects, errors and non-HTML responses always
 * reach `render`.
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
