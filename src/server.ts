import {
  createServerEntry,
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'

import { withSecurityHeaders } from '@/lib/security-headers'

const handler = createStartHandler(defaultStreamHandler)

// Static assets bypass this entry (served by the assets binding), so only
// SSR and server-function responses get the headers here.
// Default export is required by the Start server-entry contract.
// oxlint-disable-next-line import/no-default-export
export default createServerEntry({
  fetch: async (request, options) =>
    withSecurityHeaders(await handler(request, options), request.url),
})
