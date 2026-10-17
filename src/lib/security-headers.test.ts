import { describe, expect, it } from 'vitest'

import { withSecurityHeaders } from './security-headers'

describe('withSecurityHeaders', () => {
  it('adds the baseline headers and keeps status and body', async () => {
    const result = withSecurityHeaders(
      new Response('hola', { status: 404 }),
      'https://www.playasmurcia.com/',
    )

    expect(result.status).toBe(404)
    expect(await result.text()).toBe('hola')
    expect(result.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(result.headers.get('X-Frame-Options')).toBe('SAMEORIGIN')
    expect(result.headers.get('Referrer-Policy')).toBe(
      'strict-origin-when-cross-origin',
    )
    expect(result.headers.get('Strict-Transport-Security')).toContain(
      'max-age=',
    )
  })

  it('sends an enforcing CSP allowing the image and map origins', () => {
    const csp = withSecurityHeaders(
      new Response(''),
      'https://www.playasmurcia.com/',
    ).headers.get('Content-Security-Policy')

    expect(csp).toContain('https://img.playasmurcia.com')
    expect(csp).toContain('https://api.mapbox.com')
    expect(csp).toContain("frame-ancestors 'self'")
  })

  it('does not send HSTS over plain HTTP', () => {
    const result = withSecurityHeaders(
      new Response(''),
      'http://localhost:3000/',
    )

    expect(result.headers.has('Strict-Transport-Security')).toBe(false)
  })

  it('keeps headers already set by the route', () => {
    const result = withSecurityHeaders(
      new Response('', { headers: { 'X-Frame-Options': 'DENY' } }),
      'https://www.playasmurcia.com/',
    )

    expect(result.headers.get('X-Frame-Options')).toBe('DENY')
  })
})
