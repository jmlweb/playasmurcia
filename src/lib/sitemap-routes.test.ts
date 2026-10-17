import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../..')
const routesDir = resolve(root, 'src/routes')

function listRoutePatterns(dir: string, prefix = ''): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return listRoutePatterns(
        resolve(dir, entry.name),
        `${prefix}/${entry.name}`,
      )
    }
    const name = entry.name.replace(/\.tsx?$/, '')
    if (name === 'index') return [prefix || '/']
    if (name.startsWith('__')) return []
    return [`${prefix}/${name}`]
  })
}

function matchesPattern(pathname: string, pattern: string): boolean {
  const pathParts = pathname.split('/')
  const patternParts = pattern.split('/')
  return (
    pathParts.length === patternParts.length &&
    patternParts.every(
      (part, i) => part.startsWith('$') || part === pathParts[i],
    )
  )
}

describe('public/sitemap.xml', () => {
  const sitemap = readFileSync(resolve(root, 'public/sitemap.xml'), 'utf-8')
  const pathnames = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, loc]) => new URL(loc).pathname,
  )
  const patterns = listRoutePatterns(routesDir)

  it('lists URLs', () => {
    expect(pathnames.length).toBeGreaterThan(0)
  })

  it.each([
    ...new Set(pathnames.map((p) => p.replace(/^(\/[^/]+)\/.+$/, '$1/:slug'))),
  ])('has a route for %s', (shape) => {
    const pathname = shape.replace(':slug', 'sample')
    expect(patterns.some((pattern) => matchesPattern(pathname, pattern))).toBe(
      true,
    )
  })
})
