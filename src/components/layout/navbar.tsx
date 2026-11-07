import type { MouseEvent } from 'react'

import { Popover } from '@base-ui/react/popover'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import type { NavData } from '@/lib/nav-builders'

import { darkFocusRing } from '@/components/layout/focus-ring'
import { ChevronDownIcon, WaveMarkIcon } from '@/components/ui/icons'

const simpleNavLinks = [
  {
    to: '/explorar' as const,
    label: 'Todas las playas',
    section: ['/explorar', '/playas'],
  },
  { to: '/municipios' as const, label: 'Municipios', section: ['/municipios'] },
]

const isInSection = (pathname: string, section: readonly string[]) =>
  section.some((root) => pathname === root || pathname.startsWith(`${root}/`))

const collectionsSection = ['/colecciones']

const currentValue = (pathname: string, to: string) =>
  pathname === to ? 'page' : 'true'

const SM_BREAKPOINT_QUERY = '(min-width: 640px)'

// Modified or non-primary clicks (new tab, middle button) belong to the browser
const isPlainClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey

// Read as "43 playas" / "1 playa"; the pill still shows the bare number
const beachCountUnit = (count: number) => (count === 1 ? ' playa' : ' playas')

// Inactive items reserve the active underline's space, so the text never moves
const navItemUnderline = (active: boolean) =>
  active
    ? 'border-b-2 border-ocean-400 pb-0.5'
    : 'border-b-2 border-transparent pb-0.5'

function NavDropdown({ label, navData }: { label: string; navData: NavData }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const inSection = isInSection(pathname, collectionsSection)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Hangs the popup from the bar's bottom edge instead of the trigger text,
  // which sits inside the bar; a fixed offset would depend on the bar padding
  const barAnchor = () => {
    const trigger = triggerRef.current
    const bar = trigger?.closest('header')
    if (!trigger || !bar) return trigger
    return {
      contextElement: trigger,
      getBoundingClientRect: () => {
        const { x, width } = trigger.getBoundingClientRect()
        const { y, height } = bar.getBoundingClientRect()
        return new DOMRect(x, y, width, height)
      },
    }
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        ref={triggerRef}
        openOnHover
        aria-current={inSection ? 'true' : undefined}
        className={`group inline-flex items-center text-sm font-medium transition-colors hover:text-white focus-visible:text-white ${inSection ? 'text-white' : 'text-ocean-200'} ${darkFocusRing}`}
        closeDelay={150}
      >
        <span
          className={`inline-flex items-center gap-1 ${navItemUnderline(inSection)}`}
        >
          {label}
          <ChevronDownIcon className="h-3.5 w-3.5 group-data-[popup-open]:rotate-180 motion-safe:transition-transform" />
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          align="end"
          anchor={barAnchor}
          className="z-50"
          collisionAvoidance={{ side: 'none' }}
          collisionPadding={12}
          side="bottom"
          sideOffset={8}
        >
          <Popover.Popup
            aria-label={label}
            className="max-h-[var(--available-height)] w-72 overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-ocean-800 p-3 shadow-2xl"
          >
            <ul className="space-y-1">
              {navData.characteristics.map((c) => {
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
                      <span className="ml-2 rounded-full bg-ocean-700/60 px-2 py-0.5 text-xs text-ocean-200 tabular-nums">
                        {c.count}
                        <span className="sr-only">
                          {beachCountUnit(c.count)}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="mt-2 border-t border-ocean-700 pt-2">
              <Link
                activeOptions={{ exact: true }}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ocean-200 transition-colors hover:bg-ocean-700 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-800 focus-visible:outline-none"
                to="/colecciones"
              >
                Ver todas →
              </Link>
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
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const inSection = isInSection(pathname, collectionsSection)
  // The panel mounts on every open, so this follows the current page
  const [open, setOpen] = useState(inSection)

  return (
    <div>
      <button
        aria-current={inSection ? 'true' : undefined}
        aria-expanded={open}
        className={`flex min-h-11 w-full items-center justify-between text-base font-medium transition-colors hover:text-white ${inSection ? 'border-l-2 border-ocean-400 pl-2 text-white' : 'text-ocean-200'} ${darkFocusRing}`}
        type="button"
        onClick={() => {
          setOpen((prev) => !prev)
        }}
      >
        {label}
        <ChevronDownIcon
          className={`h-4 w-4 motion-safe:transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="pb-2 pl-3">
          {navData.characteristics.map((c) => {
            const active = pathname === c.href
            return (
              <Link
                key={c.href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center justify-between text-base transition-colors hover:text-white ${active ? 'font-semibold text-white' : 'text-ocean-200'} ${darkFocusRing}`}
                params={{ slug: c.href.split('/').pop()! }}
                to="/colecciones/$slug"
                onClick={onNavigate}
              >
                {c.label}
                <span className="text-xs text-ocean-200 tabular-nums">
                  {c.count}
                  <span className="sr-only">{beachCountUnit(c.count)}</span>
                </span>
              </Link>
            )
          })}
          <Link
            activeOptions={{ exact: true }}
            className={`flex min-h-11 items-center text-base font-medium transition-colors hover:text-white ${pathname === '/colecciones' ? 'text-white' : 'text-ocean-200'} ${darkFocusRing}`}
            to="/colecciones"
            onClick={onNavigate}
          >
            Ver todas →
          </Link>
        </div>
      )}
    </div>
  )
}

function TodayLink({
  className,
  onNavigate,
}: {
  className: string
  onNavigate: () => void
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <Link
      activeOptions={{ exact: true, includeHash: true }}
      className={className}
      hash="hoy"
      to="/"
      onClick={(event) => {
        onNavigate()
        if (pathname !== '/') return
        // An unchanged hash would not scroll the strip back into view
        event.preventDefault()
        document.getElementById('hoy')?.scrollIntoView()
      }}
    >
      Hoy
    </Link>
  )
}

export function Navbar({ navData }: { navData: NavData }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const navigate = useNavigate()
  const closeMenu = () => {
    setMobileOpen(false)
  }

  // Closes during render (not in an effect) for back/forward navigation too
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
  }

  useEffect(() => {
    if (!mobileOpen) return
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    // Keeps Tab inside the open menu: the page behind is covered, not gone
    const covered = [
      document.getElementById('main-content'),
      document.querySelector('body > footer'),
    ]
    covered.forEach((element) => element?.setAttribute('inert', ''))

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMobileOpen(false)
      menuButtonRef.current?.focus()
    }
    // Rotating past `sm` hides the panel; without this the page stays locked
    const breakpoint = window.matchMedia(SM_BREAKPOINT_QUERY)
    const handleBreakpoint = () => {
      setMobileOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    breakpoint.addEventListener('change', handleBreakpoint)
    return () => {
      root.style.overflow = previousOverflow
      covered.forEach((element) => element?.removeAttribute('inert'))
      document.removeEventListener('keydown', handleKeyDown)
      breakpoint.removeEventListener('change', handleBreakpoint)
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-nav sm:bg-nav/95 sm:backdrop-blur-md">
      <nav aria-label="Principal">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <Link
            className={`flex items-center gap-2 text-base font-bold tracking-tight text-white transition-opacity hover:opacity-80 sm:text-lg ${darkFocusRing}`}
            to="/"
            onClick={closeMenu}
          >
            <WaveMarkIcon className="h-6 w-6 shrink-0 text-ocean-400" />
            Playas de Murcia
          </Link>
          <div className="ml-auto hidden items-center gap-4 sm:flex md:gap-6">
            <TodayLink
              className={`inline-flex items-center text-sm font-medium text-ocean-200 transition-colors hover:text-white focus-visible:text-white ${navItemUnderline(false)} ${darkFocusRing}`}
              onNavigate={closeMenu}
            />
            {simpleNavLinks.map(({ to, label, section }) => {
              const active = isInSection(pathname, section)
              return (
                <Link
                  key={to}
                  activeOptions={{ exact: true }}
                  aria-current={active ? currentValue(pathname, to) : undefined}
                  className={`inline-flex items-center text-sm font-medium transition-colors ${active ? 'text-white' : 'text-ocean-200 hover:text-white focus-visible:text-white'} ${darkFocusRing}`}
                  to={to}
                >
                  <span className={navItemUnderline(active)}>{label}</span>
                </Link>
              )
            })}
            <NavDropdown label="Colecciones" navData={navData} />
          </div>
          {/* A plain anchor, not a router Link: the router would mark it current
              on /explorar next to "Todas las playas", and ignores the hash */}
          <a
            aria-label="Buscar playas"
            className={`ml-auto flex h-11 w-11 items-center justify-center rounded-md text-ocean-200 transition-colors hover:text-white focus-visible:text-white sm:ml-5 sm:h-7 sm:w-7 ${darkFocusRing}`}
            href="/explorar#buscar"
            onClick={(event) => {
              if (!isPlainClick(event)) return
              event.preventDefault()
              // The explorer stays inert until the menu has closed, and deferring
              // the focus past this tap would lose the phone keyboard
              // eslint-disable-next-line @eslint-react/dom-no-flush-sync
              flushSync(closeMenu)
              if (pathname !== '/explorar') {
                void navigate({ to: '/explorar', hash: 'buscar' })
                return
              }
              // An unchanged location never runs route focus, and navigating
              // anyway cancels the smooth scroll to the input
              const input = document.getElementById('buscar')
              input?.scrollIntoView({ block: 'center' })
              input?.focus({ preventScroll: true })
            }}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
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
          </a>
          <button
            ref={menuButtonRef}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className={`rounded-lg p-2.5 text-ocean-200 hover:text-white sm:hidden ${darkFocusRing}`}
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
          <div
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-100%)] overflow-y-auto overscroll-contain border-t border-white/10 bg-nav px-4 pt-2 pb-4 sm:hidden"
            id="mobile-menu"
          >
            <TodayLink
              className={`flex min-h-11 items-center text-base font-medium text-ocean-200 transition-colors hover:text-white ${darkFocusRing}`}
              onNavigate={closeMenu}
            />
            {simpleNavLinks.map(({ to, label, section }) => {
              const active = isInSection(pathname, section)
              return (
                <Link
                  key={to}
                  activeOptions={{ exact: true }}
                  aria-current={active ? currentValue(pathname, to) : undefined}
                  className={`flex min-h-11 items-center text-base font-medium transition-colors ${active ? 'border-l-2 border-ocean-400 pl-2 text-white' : 'text-ocean-200 hover:text-white'} ${darkFocusRing}`}
                  to={to}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              )
            })}
            <MobileDropdown
              label="Colecciones"
              navData={navData}
              onNavigate={closeMenu}
            />
          </div>
        )}
      </nav>
    </header>
  )
}
