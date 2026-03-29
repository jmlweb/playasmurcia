import { Popover } from '@base-ui/react/popover'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'

import { SiteFooter } from '@/components/site-footer'

import appCss from '../styles.css?url'

type NavMunicipality = {
  name: string
  slug: string
  beachCount: number
}

type NavCharacteristic = {
  label: string
  href: string
  count: number
}

type NavData = {
  municipalities: NavMunicipality[]
  characteristics: NavCharacteristic[]
}

const fetchNavData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<NavData> => {
    const { getAllBeaches, getAllMunicipalities } =
      await import('@/lib/db-data')
    const { municipalityToSlug } = await import('@/lib/slugs')
    const [beaches, municipalities] = await Promise.all([
      getAllBeaches(),
      getAllMunicipalities(),
    ])

    const municipalityNav = municipalities.map((m, i) => {
      const count = beaches.filter((b) => b.municipality === i).length
      return { name: m.name, slug: municipalityToSlug(m), beachCount: count }
    })

    const characteristics: NavCharacteristic[] = [
      {
        label: 'Bandera azul',
        href: '/colecciones/bandera-azul',
        count: beaches.filter((b) => b.certifications?.includes('blue-flag'))
          .length,
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
  },
)

export const Route = createRootRoute({
  loader: () => fetchNavData(),
  notFoundComponent: () => (
    <div className="bg-sand-50 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-ocean-200 mb-3 text-7xl font-extrabold">404</p>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Página no encontrada
      </h1>
      <p className="mb-8 text-gray-500">
        La página que buscas no existe o ha sido movida.
      </p>
      <Link
        className="bg-ocean-600 hover:bg-ocean-700 focus-visible:ring-ocean-500 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        to="/"
      >
        Volver al inicio
      </Link>
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
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M19 9l-7 7-7-7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  )
}

function NavDropdown({ label, navData }: { label: string; navData: NavData }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <Popover.Root>
      <Popover.Trigger
        openOnHover
        className="group text-ocean-200 inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-white focus-visible:text-white focus-visible:underline focus-visible:outline-none"
        closeDelay={150}
      >
        {label}
        <ChevronDownIcon className="h-3.5 w-3.5 transition-transform group-data-[popup-open]:rotate-180" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          align="center"
          className="z-50"
          collisionPadding={12}
          side="bottom"
          sideOffset={12}
        >
          <Popover.Popup className="bg-ocean-800 w-[28rem] rounded-xl border border-white/10 p-5 shadow-2xl">
            <div className="grid grid-cols-2 gap-6">
              {/* Municipalities */}
              <div>
                <p className="text-ocean-400 mb-3 text-xs font-semibold tracking-wider uppercase">
                  Municipios
                </p>
                <ul className="space-y-1">
                  {navData.municipalities.map((m) => {
                    const href = `/municipios/${m.slug}`
                    const active = pathname === href
                    return (
                      <li key={m.slug}>
                        <Link
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-none ${active ? 'bg-ocean-700 font-semibold text-white' : 'text-ocean-100 hover:bg-ocean-700 focus-visible:bg-ocean-700 hover:text-white focus-visible:text-white'}`}
                          params={{ slug: m.slug }}
                          to="/municipios/$slug"
                        >
                          {m.name}
                          <span className="bg-ocean-700/60 text-ocean-300 ml-2 rounded-full px-2 py-0.5 text-xs">
                            {m.beachCount}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Characteristics */}
              <div>
                <p className="text-ocean-400 mb-3 text-xs font-semibold tracking-wider uppercase">
                  Características
                </p>
                <ul className="space-y-1">
                  {navData.characteristics.map((c) => {
                    const active = pathname === c.href
                    return (
                      <li key={c.href}>
                        <Link
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-none ${active ? 'bg-ocean-700 font-semibold text-white' : 'text-ocean-100 hover:bg-ocean-700 focus-visible:bg-ocean-700 hover:text-white focus-visible:text-white'}`}
                          params={{ slug: c.href.split('/').pop()! }}
                          to="/colecciones/$slug"
                        >
                          {c.label}
                          <span className="bg-ocean-700/60 text-ocean-300 ml-2 rounded-full px-2 py-0.5 text-xs">
                            {c.count}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                <div className="border-ocean-700 mt-4 border-t pt-3">
                  <Link
                    className="text-ocean-300 hover:bg-ocean-700 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors hover:text-white"
                    to="/explorar"
                  >
                    Ver todas las playas
                    <svg
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
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
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div>
      <button
        aria-expanded={open}
        className="text-ocean-200 flex w-full items-center justify-between py-2.5 text-sm font-medium transition-colors hover:text-white"
        type="button"
        onClick={() => {
          setOpen((prev) => !prev)
        }}
      >
        {label}
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-2 pl-3">
          <p className="text-ocean-400 mb-1.5 text-xs font-semibold tracking-wider uppercase">
            Municipios
          </p>
          {navData.municipalities.map((m) => {
            const href = `/municipios/${m.slug}`
            const active = pathname === href
            return (
              <Link
                key={m.slug}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center justify-between py-1.5 text-sm transition-colors hover:text-white ${active ? 'font-semibold text-white' : 'text-ocean-200'}`}
                params={{ slug: m.slug }}
                to="/municipios/$slug"
                onClick={onNavigate}
              >
                {m.name}
                <span className="text-ocean-400 text-xs">{m.beachCount}</span>
              </Link>
            )
          })}
          <p className="text-ocean-400 mt-3 mb-1.5 text-xs font-semibold tracking-wider uppercase">
            Características
          </p>
          {navData.characteristics.map((c) => {
            const active = pathname === c.href
            return (
              <Link
                key={c.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center justify-between py-1.5 text-sm transition-colors hover:text-white ${active ? 'font-semibold text-white' : 'text-ocean-200'}`}
                params={{ slug: c.href.split('/').pop()! }}
                to="/colecciones/$slug"
                onClick={onNavigate}
              >
                {c.label}
                <span className="text-ocean-400 text-xs">{c.count}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navData = Route.useLoaderData()

  return (
    <nav className="bg-nav sm:bg-nav/95 sticky top-0 z-40 border-b border-white/10 sm:backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          className="text-base font-bold tracking-tight text-white transition-opacity hover:opacity-80 sm:text-lg"
          to="/"
        >
          Playas de Murcia
        </Link>
        <div className="hidden items-center gap-6 sm:flex">
          {simpleNavLinks.map(({ to, label, exact }) => (
            <Link
              key={to}
              activeOptions={{ exact }}
              activeProps={{
                className: 'text-white border-b-2 border-ocean-400 pb-0.5',
              }}
              className="text-sm font-medium transition-colors"
              inactiveProps={{
                className:
                  'text-ocean-200 hover:text-white focus-visible:text-white focus-visible:underline focus-visible:outline-none',
              }}
              to={to}
            >
              {label}
            </Link>
          ))}
          <NavDropdown label="Descubrir" navData={navData} />
        </div>
        <button
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="text-ocean-200 focus-visible:ring-ocean-400 rounded-lg p-2 hover:text-white focus-visible:ring-2 focus-visible:outline-none sm:hidden"
          type="button"
          onClick={() => {
            setMobileOpen((prev) => !prev)
          }}
        >
          {mobileOpen ? (
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          )}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-white/10 px-4 pt-2 pb-4 sm:hidden">
          {simpleNavLinks.map(({ to, label, exact }) => (
            <Link
              key={to}
              activeOptions={{ exact }}
              activeProps={{ className: 'text-white' }}
              className="block py-2.5 text-sm font-medium transition-colors"
              inactiveProps={{ className: 'text-ocean-200 hover:text-white' }}
              to={to}
              onClick={() => {
                setMobileOpen(false)
              }}
            >
              {label}
            </Link>
          ))}
          <MobileDropdown
            label="Descubrir"
            navData={navData}
            onNavigate={() => {
              setMobileOpen(false)
            }}
          />
        </div>
      )}
    </nav>
  )
}

function RootComponent() {
  const navData = Route.useLoaderData()

  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body className="bg-sand-50">
        <a
          className="focus:bg-ocean-600 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-white focus:outline-none"
          href="#main-content"
        >
          Saltar al contenido
        </a>
        <Navbar />
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
