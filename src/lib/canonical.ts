// Fixed (not env-driven) so workers.dev previews still point at production
export const CANONICAL_ORIGIN = 'https://www.playasmurcia.com'

/**
 * Absolute canonical URL for a path. Query strings and hashes are dropped and
 * the trailing slash is normalised so it matches the sitemap `<loc>` entries.
 */
export function canonicalUrl(path: string): string {
  const pathname = path.split(/[?#]/)[0]
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/'
  return normalized === '/'
    ? `${CANONICAL_ORIGIN}/`
    : `${CANONICAL_ORIGIN}${normalized.startsWith('/') ? '' : '/'}${normalized}`
}

export function canonicalLink(path: string) {
  return { rel: 'canonical', href: canonicalUrl(path) }
}

export function ogUrlMeta(path: string) {
  return { property: 'og:url', content: canonicalUrl(path) }
}
