import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SiteFooter } from './site-footer'

// A real router: the active state is computed by TanStack's Link, which the
// other footer tests mock away
const renderFooterAt = async (url: string) => {
  const rootRoute = createRootRoute({
    component: () => (
      <SiteFooter
        characteristics={[]}
        municipalities={[
          { name: 'Cartagena', slug: 'cartagena', beachCount: 50 },
        ]}
      />
    ),
  })
  const municipalityRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/municipios/$slug',
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([municipalityRoute]),
    history: createMemoryHistory({ initialEntries: [url] }),
  })
  await router.load()
  render(<RouterProvider router={router} />)
  return screen.findByRole('link', { name: /Cartagena/ })
}

describe('SiteFooter current-page link', () => {
  it('marks the current page on the bare URL', async () => {
    const link = await renderFooterAt('/municipios/cartagena')
    expect(link.getAttribute('aria-current')).toBe('page')
  })

  // The edge cache serves the bare URL's HTML for URLs that only add unknown
  // parameters, so the client must reach the same active state to hydrate
  it('keeps the current page when the URL carries unknown parameters', async () => {
    const link = await renderFooterAt(
      '/municipios/cartagena?fbclid=abc&utm_source=fb',
    )
    expect(link.getAttribute('aria-current')).toBe('page')
  })
})
