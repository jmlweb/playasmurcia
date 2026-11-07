import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SiteFooter } from './site-footer'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    params,
    activeOptions: _activeOptions,
    ...props
  }: React.ComponentProps<'a'> & {
    to: string
    params?: { slug: string }
    activeOptions?: unknown
  }) => (
    <a href={params ? to.replace('$slug', params.slug) : to} {...props}>
      {children}
    </a>
  ),
}))

const municipalities = [
  {
    name: 'San Pedro del Pinatar',
    slug: 'san-pedro-del-pinatar',
    beachCount: 8,
  },
  { name: 'La Unión', slug: 'la-union', beachCount: 1 },
]

const characteristics = [
  { label: 'Mar Menor', href: '/colecciones/mar-menor', count: 43 },
]

const renderFooter = (overrides = {}) =>
  render(
    <SiteFooter
      characteristics={characteristics}
      municipalities={municipalities}
      {...overrides}
    />,
  )

describe('SiteFooter', () => {
  it('derives the colophon line from the municipality counts', () => {
    renderFooter()

    expect(
      screen.queryByText(
        '9 playas y calas de los 2 municipios costeros de la Región de Murcia.',
      ),
    ).not.toBeNull()
  })

  it('omits the colophon line when there are no beaches', () => {
    renderFooter({ municipalities: [] })

    expect(screen.queryByText(/playas y calas/)).toBeNull()
  })

  it('exposes exactly the two named link landmarks', () => {
    renderFooter()

    expect(
      screen
        .getAllByRole('navigation', { hidden: true })
        .map((nav) => nav.getAttribute('aria-labelledby')),
    ).toStrictEqual(['footer-municipios', 'footer-colecciones'])
    expect(
      screen.queryByRole('navigation', {
        name: 'Municipios, por orden alfabético',
        hidden: true,
      }),
    ).not.toBeNull()
  })

  it('gives counts a unit in the accessible name', () => {
    renderFooter()

    expect(
      screen
        .getByRole('link', {
          name: 'San Pedro del Pinatar, 8 playas',
          hidden: true,
        })
        .getAttribute('href'),
    ).toBe('/municipios/san-pedro-del-pinatar')
    expect(
      screen.queryByRole('link', {
        name: /^La Unión,\s*1 playa$/,
        hidden: true,
      }),
    ).not.toBeNull()
  })

  it('closes each group on its index link and keeps all playas by the brand', () => {
    renderFooter()

    const hrefIn = (name: string, landmark: string) =>
      within(screen.getByRole('navigation', { name: landmark, hidden: true }))
        .getByRole('link', { name, hidden: true })
        .getAttribute('href')

    expect(
      hrefIn('Todos los municipios', 'Municipios, por orden alfabético'),
    ).toBe('/municipios')
    expect(hrefIn('Todas las colecciones', 'Colecciones destacadas')).toBe(
      '/colecciones',
    )
    expect(
      screen
        .getByRole('link', { name: 'Todas las playas' })
        .getAttribute('href'),
    ).toBe('/explorar')
  })

  it('makes the phone disclosures exclusive', () => {
    const { container } = renderFooter()

    expect(
      [...container.querySelectorAll('details')].map((details) =>
        details.getAttribute('name'),
      ),
    ).toStrictEqual(['footer-links', 'footer-links'])
  })

  it('links every source and opens it safely', () => {
    renderFooter()

    expect(
      [
        '112 Región de Murcia',
        '112 (COPLA)',
        'ADEAC/FEE',
        'AEMET',
        'Open-Meteo',
        /^NÁYADE\s*\(Ministerio de Sanidad\)$/,
        'EEA',
        'MITECO',
      ].map((name) => screen.getByRole('link', { name }).getAttribute('rel')),
    ).toStrictEqual(Array.from({ length: 8 }, () => 'noopener'))
  })

  it('closes on the trust line above the copyright', () => {
    renderFooter()

    const trust = screen.getByText(
      'Proyecto personal, sin publicidad ni fines comerciales.',
    )

    expect(trust.nextElementSibling?.textContent).toMatch(
      /^© \d{4} Playas de Murcia$/,
    )
  })
})
