import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect, useRef, useState } from 'react'

import appCss from '../styles.css?url'

interface NavMunicipality {
  name: string
  slug: string
  beachCount: number
}

interface NavCharacteristic {
  label: string
  href: string
  count: number
}

interface NavData {
  municipalities: Array<NavMunicipality>
  characteristics: Array<NavCharacteristic>
}

const fetchNavData = createServerFn({ method: 'GET' }).handler(async (): Promise<NavData> => {
  const { getAllBeaches, getAllMunicipalities } = await import('@/lib/db-data')
  const { municipalityToSlug } = await import('@/lib/slugs')
  const [beaches, municipalities] = await Promise.all([
    getAllBeaches(),
    getAllMunicipalities(),
  ])

  const municipalityNav = municipalities.map((m, i) => {
    const count = beaches.filter((b) => b.municipality === i).length
    return { name: m.name, slug: municipalityToSlug(m), beachCount: count }
  })

  const characteristics: Array<NavCharacteristic> = [
    {
      label: 'Bandera azul',
      href: '/colecciones/bandera-azul',
      count: beaches.filter((b) => b.certifications?.includes('blue-flag')).length,
    },
    {
      label: 'Accesible',
      href: '/colecciones/accesibles',
      count: beaches.filter((b) => b.accessDifficulty === 'easy').length,
    },
    {
      label: 'Nudista',
      href: '/colecciones/playas-nudistas',
      count: beaches.filter((b) => b.nudist).length,
    },
    {
      label: 'Pet friendly',
      href: '/colecciones/playas-para-perros',
      count: beaches.filter((b) => b.dogFriendly).length,
    },
    {
      label: 'Familiares',
      href: '/colecciones/playas-familiares',
      count: beaches.filter((b) => b.childSafe).length,
    },
  ]

  return { municipalities: municipalityNav, characteristics }
})

export const Route = createRootRoute({
  loader: () => fetchNavData(),
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

const simpleNavLinks = [
  { to: '/' as const, label: 'Inicio', exact: true },
  { to: '/explorar' as const, label: 'Explorar' },
  { to: '/colecciones' as const, label: 'Colecciones' },
  { to: '/mares' as const, label: 'Mares' },
  { to: '/comparar' as const, label: 'Comparar' },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function NavDropdown({
  label,
  navData,
}: {
  label: string
  navData: NavData
}) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  function handleMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Close on click outside
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [open])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm font-medium text-ocean-200 transition-colors hover:text-white focus-visible:text-white focus-visible:underline focus-visible:outline-none"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-[28rem] -translate-x-1/2 rounded-xl border border-white/10 bg-ocean-800 p-5 shadow-2xl animate-dropdown"
          role="menu"
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Municipalities */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ocean-400">
                Municipios
              </p>
              <ul className="space-y-1" role="none">
                {navData.municipalities.map((m) => (
                  <li key={m.slug} role="none">
                    <a
                      href={`/municipios/${m.slug}`}
                      role="menuitem"
                      className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm text-ocean-100 transition-colors hover:bg-ocean-700 hover:text-white focus-visible:bg-ocean-700 focus-visible:text-white focus-visible:outline-none"
                      onClick={() => setOpen(false)}
                    >
                      {m.name}
                      <span className="ml-2 rounded-full bg-ocean-700/60 px-2 py-0.5 text-xs text-ocean-300">
                        {m.beachCount}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Characteristics */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ocean-400">
                Caracteristicas
              </p>
              <ul className="space-y-1" role="none">
                {navData.characteristics.map((c) => (
                  <li key={c.href} role="none">
                    <a
                      href={c.href}
                      role="menuitem"
                      className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm text-ocean-100 transition-colors hover:bg-ocean-700 hover:text-white focus-visible:bg-ocean-700 focus-visible:text-white focus-visible:outline-none"
                      onClick={() => setOpen(false)}
                    >
                      {c.label}
                      <span className="ml-2 rounded-full bg-ocean-700/60 px-2 py-0.5 text-xs text-ocean-300">
                        {c.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-ocean-700 pt-3">
                <a
                  href="/explorar"
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ocean-300 transition-colors hover:bg-ocean-700 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  Ver todas las playas
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileDropdown({
  label,
  navData,
  onNavigate,
}: {
  label: string
  navData: NavData
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between py-2.5 text-sm font-medium text-ocean-200 transition-colors hover:text-white"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-2 pl-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ocean-400">
            Municipios
          </p>
          {navData.municipalities.map((m) => (
            <a
              key={m.slug}
              href={`/municipios/${m.slug}`}
              className="flex items-center justify-between py-1.5 text-sm text-ocean-200 transition-colors hover:text-white"
              onClick={onNavigate}
            >
              {m.name}
              <span className="text-xs text-ocean-400">{m.beachCount}</span>
            </a>
          ))}
          <p className="mb-1.5 mt-3 text-xs font-semibold uppercase tracking-wider text-ocean-400">
            Caracteristicas
          </p>
          {navData.characteristics.map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="flex items-center justify-between py-1.5 text-sm text-ocean-200 transition-colors hover:text-white"
              onClick={onNavigate}
            >
              {c.label}
              <span className="text-xs text-ocean-400">{c.count}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navData = Route.useLoaderData()

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
          {simpleNavLinks.map(({ to, label, exact }) => (
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
          <NavDropdown label="Descubrir" navData={navData} />
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
          {simpleNavLinks.map(({ to, label, exact }) => (
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
          <MobileDropdown
            label="Descubrir"
            navData={navData}
            onNavigate={() => setMobileOpen(false)}
          />
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
