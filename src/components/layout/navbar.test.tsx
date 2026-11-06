import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Navbar } from './navbar'

const useRouterState = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-router', () => ({
  useRouterState,
  Link: ({
    children,
    to,
    params: _params,
    ...props
  }: React.ComponentProps<'a'> & { to: string; params?: unknown }) => (
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
    ['/playas/cala-cortina', 'Todas las playas'],
    ['/explorar', 'Todas las playas'],
    ['/municipios/cartagena', 'Municipios'],
  ])('marks the section of %s as current', (pathname, label) => {
    renderNavbar(pathname)
    expect(screen.getByRole('link', { name: label }).ariaCurrent).toBe('page')
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
