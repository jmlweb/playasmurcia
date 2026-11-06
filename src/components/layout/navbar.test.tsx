import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Navbar } from './navbar'

const useRouterState = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-router', () => ({
  useRouterState,
  Link: ({
    children,
    to,
    params: _params,
    activeOptions: _activeOptions,
    hash: _hash,
    ...props
  }: React.ComponentProps<'a'> & {
    to: string
    params?: unknown
    activeOptions?: unknown
    hash?: string
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

const navData = {
  municipalities: [{ name: 'Cartagena', slug: 'cartagena', beachCount: 69 }],
  characteristics: [
    { label: 'Mar Menor', href: '/colecciones/mar-menor', count: 43 },
  ],
}

const openMenu = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
}

const getMenu = () => {
  const menu = document.getElementById('mobile-menu')
  if (!menu) throw new Error('Mobile menu is not open')
  return menu
}

const renderNavbar = (pathname = '/') => {
  useRouterState.mockImplementation(
    ({
      select,
    }: {
      select: (state: { location: { pathname: string } }) => unknown
    }) => select({ location: { pathname } }),
  )
  return render(
    <>
      <Navbar navData={navData} />
      <div id="main-content" />
    </>,
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('names the primary navigation inside a banner', () => {
    renderNavbar()
    expect(
      screen.getByRole('banner').querySelector('nav[aria-label="Principal"]'),
    ).toBeTruthy()
  })

  it.each([
    ['/playas/cala-cortina', 'Todas las playas', 'true'],
    ['/explorar', 'Todas las playas', 'page'],
    ['/municipios', 'Municipios', 'page'],
    ['/municipios/cartagena', 'Municipios', 'true'],
  ])('marks the section of %s as current', (pathname, label, current) => {
    renderNavbar(pathname)
    expect(screen.getByRole('link', { name: label }).ariaCurrent).toBe(current)
  })

  it('names the collections trigger and marks it inside its section', () => {
    renderNavbar('/colecciones/mar-menor')
    expect(
      screen.getByRole('button', { name: 'Colecciones' }).ariaCurrent,
    ).toBe('true')
  })

  it('does not treat a shared prefix as the same section', () => {
    renderNavbar('/playas-raras')
    expect(
      screen.getByRole('link', { name: 'Todas las playas' }).ariaCurrent,
    ).toBeNull()
  })

  it('exposes the menu state on the toggle', () => {
    renderNavbar()
    const toggle = screen.getByRole('button', { name: 'Abrir menú' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(document.getElementById('mobile-menu')).toBeTruthy()
  })

  it('locks the page behind the open menu and releases it on Esc', () => {
    renderNavbar()
    const toggle = screen.getByRole('button', { name: 'Abrir menú' })
    const page = document.getElementById('main-content')
    fireEvent.click(toggle)
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(page?.hasAttribute('inert')).toBe(true)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.getElementById('mobile-menu')).toBeNull()
    expect(document.documentElement.style.overflow).toBe('')
    expect(page?.hasAttribute('inert')).toBe(false)
    expect(document.activeElement).toBe(toggle)
  })

  it('lists collections with their index on phones, without municipalities', () => {
    renderNavbar()
    openMenu()
    fireEvent.click(
      within(getMenu()).getByRole('button', { name: 'Colecciones' }),
    )
    const links = within(getMenu())
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
    expect(links).toContain('/colecciones')
    expect(links).toContain('/colecciones/$slug')
    expect(links).not.toContain('/municipios/$slug')
  })

  it('opens the phone collections group inside its section', () => {
    renderNavbar('/colecciones')
    openMenu()
    const toggle = within(getMenu()).getByRole('button', {
      name: 'Colecciones',
    })
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(toggle.ariaCurrent).toBe('true')
  })

  it('keeps the phone collections group closed elsewhere', () => {
    renderNavbar('/municipios')
    openMenu()
    expect(
      within(getMenu())
        .getByRole('button', { name: 'Colecciones' })
        .getAttribute('aria-expanded'),
    ).toBe('false')
  })

  describe('search', () => {
    const scrollIntoView = vi.fn()

    const renderExplorer = () => {
      renderNavbar('/explorar')
      const input = document.createElement('input')
      input.id = 'buscar'
      input.scrollIntoView = scrollIntoView
      document.getElementById('main-content')?.append(input)
      return input
    }

    it('brings the input into view before focusing it on the explorer', () => {
      const input = renderExplorer()
      const notPrevented = fireEvent.click(
        screen.getByRole('link', { name: 'Buscar playas' }),
      )
      expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center' })
      expect(document.activeElement).toBe(input)
      expect(notPrevented).toBe(false)
    })

    it('closes the menu first so the input is no longer inert', () => {
      const input = renderExplorer()
      openMenu()
      expect(input.closest('[inert]')).toBeTruthy()
      fireEvent.click(screen.getByRole('link', { name: 'Buscar playas' }))
      expect(document.getElementById('mobile-menu')).toBeNull()
      expect(input.closest('[inert]')).toBeNull()
      expect(document.activeElement).toBe(input)
    })

    it('navigates normally from any other page', () => {
      renderNavbar('/municipios')
      const notPrevented = fireEvent.click(
        screen.getByRole('link', { name: 'Buscar playas' }),
      )
      expect(notPrevented).toBe(true)
    })
  })

  describe('today link', () => {
    it('scrolls back to the strip when already on the homepage', () => {
      renderNavbar('/')
      const strip = document.createElement('section')
      strip.id = 'hoy'
      const scrollIntoView = vi.fn()
      strip.scrollIntoView = scrollIntoView
      document.getElementById('main-content')?.append(strip)
      const notPrevented = fireEvent.click(
        within(screen.getByRole('navigation')).getAllByRole('link', {
          name: 'Hoy',
        })[0],
      )
      expect(scrollIntoView).toHaveBeenCalled()
      expect(notPrevented).toBe(false)
    })

    it('navigates to the homepage from any other page', () => {
      renderNavbar('/municipios')
      const notPrevented = fireEvent.click(
        screen.getByRole('link', { name: 'Hoy' }),
      )
      expect(notPrevented).toBe(true)
    })
  })

  it('closes the menu when the path changes', () => {
    const { rerender } = renderNavbar('/')
    openMenu()
    useRouterState.mockImplementation(
      ({
        select,
      }: {
        select: (state: { location: { pathname: string } }) => unknown
      }) => select({ location: { pathname: '/municipios' } }),
    )
    rerender(
      <>
        <Navbar navData={navData} />
        <div id="main-content" />
      </>,
    )
    expect(document.getElementById('mobile-menu')).toBeNull()
  })
})
