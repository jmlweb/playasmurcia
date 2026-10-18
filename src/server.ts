import {
  createServerEntry,
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'

import type { CacheVariant } from '@/lib/html-cache'

import { isCacheableRequest, withHtmlCache } from '@/lib/html-cache'
import {
  asHtmlRequest,
  prefersMarkdown,
  toMarkdownResponse,
  withAcceptVary,
  withDiscoveryLinks,
} from '@/lib/markdown-negotiation'
import { withSecurityHeaders } from '@/lib/security-headers'

// Minimal Cloudflare Worker types: the project does not ship workers-types
type WorkerEnv = {
  CF_VERSION_METADATA?: { id: string }
}
type WorkerContext = {
  waitUntil: (promise: Promise<unknown>) => void
}

const handler = createStartHandler(defaultStreamHandler)

const startEntry = createServerEntry({
  fetch: async (request, options) =>
    withSecurityHeaders(
      withAcceptVary(await handler(request, options)),
      request.url,
    ),
})

// Local dev runs in workerd too (Cache API available), but caching HTML there
// would hide code changes for the whole TTL
const isHtmlCacheEnabled = (): boolean =>
  !import.meta.env.DEV && typeof caches !== 'undefined'

// Static assets bypass this entry (served by the assets binding), so only
// SSR and server-function responses get the headers here.
// Default export is required by the Start server-entry contract.
// oxlint-disable-next-line import/no-default-export
export default {
  fetch: async (request: Request, env: WorkerEnv, ctx: WorkerContext) => {
    // Agents sending `Accept: text/markdown` get the same page as markdown;
    // it is converted from the (cached) HTML render and cached separately
    const isMarkdownRequest =
      isCacheableRequest(request) &&
      prefersMarkdown(request.headers.get('accept'))
    const htmlRequest = isMarkdownRequest ? asHtmlRequest(request) : request

    const cached = async (
      cacheRequest: Request,
      variant: CacheVariant,
      render: () => Promise<Response>,
    ) => {
      if (!isHtmlCacheEnabled()) return render()
      return withHtmlCache(
        cacheRequest,
        {
          versionId: env.CF_VERSION_METADATA?.id ?? 'unversioned',
          waitUntil: (promise) => {
            ctx.waitUntil(promise)
          },
          cache: caches.default,
          variant,
        },
        render,
      )
    }

    const renderHtml = async () =>
      cached(htmlRequest, 'html', async () =>
        startEntry.fetch(htmlRequest, env as never),
      )
    if (!isMarkdownRequest) {
      return withDiscoveryLinks(await renderHtml(), request.url)
    }
    return cached(request, 'markdown', async () =>
      toMarkdownResponse(await renderHtml(), request.url),
    )
  },
}
