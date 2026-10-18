import {
  createServerEntry,
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'

import { withHtmlCache } from '@/lib/html-cache'
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
    withSecurityHeaders(await handler(request, options), request.url),
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
  fetch: (request: Request, env: WorkerEnv, ctx: WorkerContext) => {
    const render = async () => startEntry.fetch(request, env as never)
    if (!isHtmlCacheEnabled()) return render()
    return withHtmlCache(
      request,
      {
        versionId: env.CF_VERSION_METADATA?.id ?? 'unversioned',
        waitUntil: (promise) => {
          ctx.waitUntil(promise)
        },
        cache: caches.default,
      },
      render,
    )
  },
}
