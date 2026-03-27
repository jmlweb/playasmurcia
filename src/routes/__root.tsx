import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand-50 px-4 text-center">
      <p className="mb-3 text-7xl font-extrabold text-ocean-200">404</p>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Pagina no encontrada</h1>
      <p className="mb-8 text-gray-500">La pagina que buscas no existe o ha sido movida.</p>
      <a
        href="/"
        className="rounded-full bg-ocean-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700"
      >
        Volver al inicio
      </a>
    </div>
  ),
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
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
})

function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-ocean-900/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="/"
          className="text-base font-bold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          Playas de Murcia
        </a>
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="text-sm font-medium text-ocean-200 transition-colors hover:text-white"
          >
            Explorar
          </a>
          <a
            href="/municipios"
            className="text-sm font-medium text-ocean-200 transition-colors hover:text-white"
          >
            Municipios
          </a>
          <a
            href="/colecciones"
            className="text-sm font-medium text-ocean-200 transition-colors hover:text-white"
          >
            Colecciones
          </a>
          <a
            href="/mares"
            className="text-sm font-medium text-ocean-200 transition-colors hover:text-white"
          >
            Mares
          </a>
        </div>
      </div>
    </nav>
  )
}

function RootComponent() {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body className="bg-sand-50">
        <Navbar />
        <Outlet />
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
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
