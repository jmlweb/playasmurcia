import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'

import type { NavData } from '@/lib/nav-builders'

import { Navbar } from '@/components/layout/navbar'
import { NotFound } from '@/components/layout/not-found'
import { RootErrorComponent } from '@/components/layout/root-error'
import { SiteFooter } from '@/components/layout/site-footer'
import { useWebMcp } from '@/features/webmcp/use-webmcp'
import { pictureUrl } from '@/lib/images'

import appCss from '../styles.css?url'

const fetchNavData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<NavData> => {
    const { getAllBeaches, getAllMunicipalities } =
      await import('@/lib/db-data/beach-queries')
    const { buildMunicipalityNav, buildCharacteristicCounts } =
      await import('@/lib/nav-builders')
    const [beaches, municipalities] = await Promise.all([
      getAllBeaches(),
      getAllMunicipalities(),
    ])

    return {
      municipalities: buildMunicipalityNav(beaches, municipalities),
      characteristics: buildCharacteristicCounts(beaches),
    }
  },
)

export const Route = createRootRoute({
  loader: () => fetchNavData(),
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Playas de Murcia',
      },
      {
        name: 'description',
        content: 'Descubre las mejores playas de la Región de Murcia',
      },
      {
        name: 'robots',
        content: 'noai, noimageai',
      },
      {
        // WebMCP origin trial (Chrome); expires 2027-03-30, renew and redeploy
        httpEquiv: 'origin-trial',
        content:
          'Ah+uXt19cVme+dvxlf9fDIlXuojvi2TUt7pCxopNgBJr3+0jhIuiGCcoqpsvzCclmr7W1ObnGAXj+m0J0xM0WQ8AAABUeyJvcmlnaW4iOiJodHRwczovL3d3dy5wbGF5YXNtdXJjaWEuY29tOjQ0MyIsImZlYXR1cmUiOiJXZWJNQ1AiLCJleHBpcnkiOjE4MDYzNjQ4MDB9',
      },
      { property: 'og:site_name', content: 'Playas de Murcia' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: pictureUrl('hero.png') },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700;800&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  const navData = Route.useLoaderData()
  useWebMcp()

  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body className="bg-sand-50">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-ocean-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
          href="#main-content"
        >
          Saltar al contenido
        </a>
        <Navbar navData={navData} />
        <div id="main-content">
          <Outlet />
        </div>
        <SiteFooter
          characteristics={navData.characteristics}
          municipalities={navData.municipalities}
        />
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: 'bottom-left',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
