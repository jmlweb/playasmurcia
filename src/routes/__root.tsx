import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useState } from 'react'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand-50 px-4 text-center">
      <p className="mb-3 text-7xl font-extrabold text-ocean-200">404</p>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Pagina no encontrada</h1>
      <p className="mb-8 text-gray-500">La pagina que buscas no existe o ha sido movida.</p>
      <a
        href="/"
        className="rounded-full bg-ocean-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-700 focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 focus:outline-none"
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

const navLinks = [
  { to: '/' as const, label: 'Inicio', exact: true },
  { to: '/explorar' as const, label: 'Explorar' },
  { to: '/municipios' as const, label: 'Municipios' },
  { to: '/colecciones' as const, label: 'Colecciones' },
  { to: '/mares' as const, label: 'Mares' },
  { to: '/comparar' as const, label: 'Comparar' },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-ocean-900 sm:bg-ocean-900/95 sm:backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-base font-bold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          Playas de Murcia
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map(({ to, label, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="text-sm font-medium text-ocean-200 transition-colors hover:text-white focus-visible:text-white focus-visible:underline focus-visible:outline-none"
              activeProps={{ className: 'text-sm font-medium text-white border-b-2 border-ocean-400 pb-0.5 transition-colors hover:text-white focus-visible:underline focus-visible:outline-none' }}
            >
              {label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          className="sm:hidden rounded-lg p-2 text-ocean-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
          aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {mobileOpen && (
        <div className="sm:hidden border-t border-white/10 px-4 pb-4 pt-2">
          {navLinks.map(({ to, label, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="block py-2.5 text-sm font-medium text-ocean-200 transition-colors hover:text-white"
              activeProps={{ className: 'block py-2.5 text-sm font-medium text-white transition-colors hover:text-white' }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ocean-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <div id="main-content">
          <Outlet />
        </div>
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
