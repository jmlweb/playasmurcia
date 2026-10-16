import { Popover } from '@base-ui/react/popover'
import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'

import type { NavData } from '@/lib/nav-builders'

import { ChevronDownIcon } from '@/components/ui/icons'

const simpleNavLinks = [
  { to: '/explorar' as const, label: 'Playas' },
  { to: '/colecciones' as const, label: 'Colecciones' },
]

function NavDropdown({ label, navData }: { label: string; navData: NavData }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <Popover.Root>
      <Popover.Trigger
        openOnHover
        className="group inline-flex items-center gap-1 text-sm font-medium text-ocean-200 transition-colors hover:text-white focus-visible:rounded focus-visible:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-900 focus-visible:outline-none"
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
          <Popover.Popup className="w-[28rem] rounded-xl border border-white/10 bg-ocean-800 p-5 shadow-2xl">
            <div className="grid grid-cols-2 gap-6">
              {/* Municipalities — top 5 */}
              <div>
                <p className="mb-3 text-xs font-semibold tracking-wider text-ocean-400 uppercase">
                  Municipios
                </p>
                <ul className="space-y-1">
                  {navData.municipalities.slice(0, 5).map((m) => {
                    const href = `/municipios/${m.slug}`
                    const active = pathname.startsWith(href)
                    return (
                      <li key={m.slug}>
                        <Link
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-800 focus-visible:outline-none ${active ? 'bg-ocean-700 font-semibold text-white' : 'text-ocean-100 hover:bg-ocean-700 hover:text-white focus-visible:bg-ocean-700 focus-visible:text-white'}`}
                          params={{ slug: m.slug }}
                          to="/municipios/$slug"
                        >
                          {m.name}
                          <span className="ml-2 rounded-full bg-ocean-700/60 px-2 py-0.5 text-xs text-ocean-300">
                            {m.beachCount}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Collections — top 4 */}
              <div>
                <p className="mb-3 text-xs font-semibold tracking-wider text-ocean-400 uppercase">
                  Colecciones
                </p>
                <ul className="space-y-1">
                  {navData.characteristics.slice(0, 4).map((c) => {
                    const active = pathname.startsWith(c.href)
                    return (
                      <li key={c.href}>
                        <Link
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-800 focus-visible:outline-none ${active ? 'bg-ocean-700 font-semibold text-white' : 'text-ocean-100 hover:bg-ocean-700 hover:text-white focus-visible:bg-ocean-700 focus-visible:text-white'}`}
                          params={{ slug: c.href.split('/').pop()! }}
                          to="/colecciones/$slug"
                        >
                          {c.label}
                          <span className="ml-2 rounded-full bg-ocean-700/60 px-2 py-0.5 text-xs text-ocean-300">
                            {c.count}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                <div className="mt-3 border-t border-ocean-700 pt-3">
                  <Link
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ocean-300 transition-colors hover:bg-ocean-700 hover:text-white"
                    to="/colecciones"
                  >
                    Ver todas →
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
        className="flex w-full items-center justify-between py-2.5 text-sm font-medium text-ocean-200 transition-colors hover:text-white"
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
          <p className="mb-1.5 text-xs font-semibold tracking-wider text-ocean-400 uppercase">
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
                <span className="text-xs text-ocean-400">{m.beachCount}</span>
              </Link>
            )
          })}
          <p className="mt-3 mb-1.5 text-xs font-semibold tracking-wider text-ocean-400 uppercase">
            Colecciones
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
                <span className="text-xs text-ocean-400">{c.count}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Navbar({ navData }: { navData: NavData }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-nav sm:bg-nav/95 sm:backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          className="flex items-center gap-2 text-base font-bold tracking-tight text-white transition-opacity hover:opacity-80 sm:text-lg"
          to="/"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6 shrink-0 text-ocean-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 15c0 0 2-2 4-2s4 2 6 2 4-2 4-2M3 10c0 0 2-2 4-2s4 2 6 2 4-2 4-2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          Playas de Murcia
        </Link>
        <div className="hidden items-center gap-6 sm:flex">
          {simpleNavLinks.map(({ to, label }) => (
            <Link
              key={to}
              activeOptions={{ exact: false }}
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
          <Link
            aria-label="Buscar playas"
            className="rounded-md p-1 text-ocean-300 transition-colors hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:outline-none"
            to="/explorar"
          >
            <svg
              aria-hidden="true"
              className="h-4.5 w-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </Link>
        </div>
        <button
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="rounded-lg p-2 text-ocean-200 hover:text-white focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:outline-none sm:hidden"
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
          {simpleNavLinks.map(({ to, label }) => (
            <Link
              key={to}
              activeOptions={{ exact: false }}
              activeProps={{
                className: 'text-white border-l-2 border-ocean-400 pl-2',
              }}
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
