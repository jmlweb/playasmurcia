// Enforcing: verified against production with zero violations before the switch.
// 'unsafe-inline' is needed for TanStack Start's hydration scripts and JSON-LD.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://img.playasmurcia.com https://api.mapbox.com https://unpkg.com",
  "connect-src 'self' https://api.mapbox.com https://events.mapbox.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const HSTS_MAX_AGE_SECONDS = 60 * 60 * 24 * 180

/**
 * Returns a copy of `response` with security headers added. Headers a route
 * already set are left untouched.
 */
export function withSecurityHeaders(
  response: Response,
  requestUrl: string,
): Response {
  const headers = new Headers(response.headers)
  const defaults: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': contentSecurityPolicy,
  }
  // Browsers ignore HSTS over plain HTTP, so only send it on HTTPS requests
  if (new URL(requestUrl).protocol === 'https:') {
    defaults['Strict-Transport-Security'] = `max-age=${HSTS_MAX_AGE_SECONDS}`
  }
  for (const [name, value] of Object.entries(defaults)) {
    if (!headers.has(name)) headers.set(name, value)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
