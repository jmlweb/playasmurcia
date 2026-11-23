import { describe, expect, it, vi } from 'vitest'

import {
  htmlCacheKey,
  isCacheableRequest,
  isCacheableResponse,
  withHtmlCache,
} from './html-cache'

function fakeCache() {
  const store = new Map<string, Response>()
  const match = vi.fn(async (key: Request) => store.get(key.url)?.clone())
  const put = vi.fn(async (key: Request, response: Response) => {
    store.set(key.url, response)
  })
  return { cache: { match, put } as unknown as Cache, store, match, put }
}

function html(body = '<html></html>', status = 200): Response {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

const waitUntil = (promise: Promise<unknown>) => void promise

describe('isCacheableRequest', () => {
  it('accepts GET documents', () => {
    expect(
      isCacheableRequest(new Request('https://www.playasmurcia.com/playas/x')),
    ).toBe(true)
  })

  it('rejects non-GET and server-function calls', () => {
    expect(
      isCacheableRequest(
        new Request('https://www.playasmurcia.com/', { method: 'POST' }),
      ),
    ).toBe(false)
    expect(
      isCacheableRequest(
        new Request('https://www.playasmurcia.com/_serverFn/abc?payload=1'),
      ),
    ).toBe(false)
  })
})

describe('isCacheableResponse', () => {
  it('rejects a response marked no-store', () => {
    expect(
      isCacheableResponse(
        new Response('x', {
          headers: {
            'Content-Type': 'text/markdown',
            'Cache-Control': 'no-store',
          },
        }),
      ),
    ).toBe(false)
  })

  it('only accepts 200 and 404 HTML', () => {
    expect(isCacheableResponse(html())).toBe(true)
    expect(isCacheableResponse(html('missing', 404))).toBe(true)
    expect(isCacheableResponse(html('nope', 500))).toBe(false)
    expect(isCacheableResponse(new Response('{}', { status: 200 }))).toBe(false)
    expect(
      isCacheableResponse(
        new Response(null, { status: 302, headers: { location: '/' } }),
      ),
    ).toBe(false)
  })
})

describe('htmlCacheKey', () => {
  const keyOf = (pathAndQuery: string, variant?: 'html' | 'markdown') =>
    htmlCacheKey(
      new Request(`https://www.playasmurcia.com${pathAndQuery}`),
      'v1',
      variant,
    ).url

  it('scopes the key by variant, version and path', () => {
    expect(keyOf('/playas/cala')).toBe(
      'https://playasmurcia.cache/html/v1/playas/cala',
    )
    expect(keyOf('/playas/cala', 'markdown')).toBe(
      'https://playasmurcia.cache/markdown/v1/playas/cala',
    )
  })

  it('drops the whole query on routes without search parameters', () => {
    expect(keyOf('/playas/cala?x=1')).toBe(keyOf('/playas/cala'))
    expect(keyOf('/?fbclid=abc')).toBe(keyOf('/'))
  })

  it('ignores unknown parameters such as fbclid and utm_*', () => {
    expect(keyOf('/municipios/cartagena?fbclid=abc&utm_source=fb')).toBe(
      keyOf('/municipios/cartagena'),
    )
    expect(keyOf('/explorar?x=random-1')).toBe(keyOf('/explorar'))
    expect(keyOf('/explorar?x=random-2')).toBe(keyOf('/explorar'))
  })

  it('keeps known parameters, so each filter set gets its own entry', () => {
    expect(keyOf('/explorar?sort=name')).toBe(
      'https://playasmurcia.cache/html/v1/explorar?sort=name',
    )
    expect(keyOf('/explorar?sort=name')).not.toBe(
      keyOf('/explorar?sort=length'),
    )
    expect(keyOf('/explorar?q=calblanque')).not.toBe(keyOf('/explorar'))
    expect(keyOf('/municipios/cartagena?page=2')).not.toBe(
      keyOf('/municipios/cartagena'),
    )
    expect(keyOf('/colecciones/calas?sort=name')).not.toBe(
      keyOf('/colecciones/calas'),
    )
  })

  it('orders known parameters stably and keeps their values', () => {
    expect(
      keyOf('/explorar?sort=name&fbclid=abc&municipality=%5B1%2C2%5D'),
    ).toBe(keyOf('/explorar?municipality=%5B1%2C2%5D&sort=name'))
    expect(keyOf('/explorar?municipality=%5B2%2C1%5D')).not.toBe(
      keyOf('/explorar?municipality=%5B1%2C2%5D'),
    )
    // The router decodes search with URLSearchParams too: both are "a b"
    expect(keyOf('/explorar?q=a+b')).toBe(keyOf('/explorar?q=a%20b'))
    expect(keyOf('/explorar?q=a+b')).not.toBe(keyOf('/explorar?q=a%2Bb'))
  })

  it('only keeps the parameters the matched route validates', () => {
    expect(keyOf('/colecciones/calas?municipality=%5B1%5D')).toBe(
      keyOf('/colecciones/calas'),
    )
    expect(keyOf('/municipios/cartagena?q=calblanque')).toBe(
      keyOf('/municipios/cartagena'),
    )
    expect(keyOf('/municipios/cartagena?dogFriendly=true')).not.toBe(
      keyOf('/municipios/cartagena'),
    )
  })
})

describe('withHtmlCache', () => {
  const request = new Request('https://www.playasmurcia.com/playas/cala')

  it('renders on a miss, stores the copy, then serves the hit', async () => {
    const { cache, store } = fakeCache()
    const render = vi.fn(async () => html('<p>fresh</p>'))
    const options = { versionId: 'v1', waitUntil, cache }

    const miss = await withHtmlCache(request, options, render)
    expect(await miss.text()).toBe('<p>fresh</p>')
    expect(miss.headers.get('cache-control')).toBe('no-cache')
    expect(render).toHaveBeenCalledTimes(1)

    const stored = store.get(htmlCacheKey(request, 'v1').url)
    expect(stored?.headers.get('cache-control')).toBe('public, s-maxage=3600')

    const hit = await withHtmlCache(request, options, render)
    expect(await hit.text()).toBe('<p>fresh</p>')
    expect(hit.headers.get('cache-control')).toBe('no-cache')
    expect(render).toHaveBeenCalledTimes(1)
  })

  it('serves a request with an unknown parameter from the same entry', async () => {
    const { cache } = fakeCache()
    const render = vi.fn(async () => html('<p>fresh</p>'))
    const options = { versionId: 'v1', waitUntil, cache }

    await withHtmlCache(request, options, render)
    const hit = await withHtmlCache(
      new Request('https://www.playasmurcia.com/playas/cala?fbclid=abc'),
      options,
      render,
    )
    expect(await hit.text()).toBe('<p>fresh</p>')
    expect(render).toHaveBeenCalledTimes(1)
  })

  it('stores a 404 page briefly and serves it with its status', async () => {
    const { cache, store } = fakeCache()
    const render = vi.fn(async () => html('missing', 404))
    const options = { versionId: 'v1', waitUntil, cache }

    const miss = await withHtmlCache(request, options, render)
    expect(miss.status).toBe(404)

    const stored = store.get(htmlCacheKey(request, 'v1').url)
    expect(stored?.headers.get('cache-control')).toBe('public, s-maxage=60')

    const hit = await withHtmlCache(request, options, render)
    expect(hit.status).toBe(404)
    expect(hit.headers.get('cache-control')).toBe('no-cache')
    expect(render).toHaveBeenCalledTimes(1)
  })

  it('does not store non-cacheable responses', async () => {
    const { cache, put } = fakeCache()
    const render = vi.fn(async () => html('boom', 500))

    const response = await withHtmlCache(
      request,
      { versionId: 'v1', waitUntil, cache },
      render,
    )
    expect(response.status).toBe(500)
    expect(put).not.toHaveBeenCalled()
  })

  it('bypasses the cache for server-function calls', async () => {
    const { cache, match } = fakeCache()
    const render = vi.fn(async () => new Response('{}'))

    await withHtmlCache(
      new Request('https://www.playasmurcia.com/_serverFn/abc'),
      { versionId: 'v1', waitUntil, cache },
      render,
    )
    expect(match).not.toHaveBeenCalled()
    expect(render).toHaveBeenCalledTimes(1)
  })

  it('separates entries by deploy version', async () => {
    const { cache } = fakeCache()
    const render = vi.fn(async () => html())

    await withHtmlCache(request, { versionId: 'v1', waitUntil, cache }, render)
    await withHtmlCache(request, { versionId: 'v2', waitUntil, cache }, render)
    expect(render).toHaveBeenCalledTimes(2)
  })
})
