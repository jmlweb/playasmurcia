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
  it('only accepts 200 HTML', () => {
    expect(isCacheableResponse(html())).toBe(true)
    expect(isCacheableResponse(html('nope', 404))).toBe(false)
    expect(isCacheableResponse(new Response('{}', { status: 200 }))).toBe(false)
    expect(
      isCacheableResponse(
        new Response(null, { status: 302, headers: { location: '/' } }),
      ),
    ).toBe(false)
  })
})

describe('htmlCacheKey', () => {
  it('scopes the key by version, path and query', () => {
    const key = htmlCacheKey(
      new Request('https://www.playasmurcia.com/playas/cala?x=1'),
      'v1',
    )
    expect(key.url).toBe('https://playasmurcia.cache/html/v1/playas/cala?x=1')
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

  it('does not store non-cacheable responses', async () => {
    const { cache, put } = fakeCache()
    const render = vi.fn(async () => html('missing', 404))

    const response = await withHtmlCache(
      request,
      { versionId: 'v1', waitUntil, cache },
      render,
    )
    expect(response.status).toBe(404)
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
