import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Breadcrumb } from '@/components/layout/breadcrumb'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    className,
  }: {
    to: string
    children: React.ReactNode
    className?: string
  }) => (
    <a className={className} href={to}>
      {children}
    </a>
  ),
}))

const items = [
  { label: 'Inicio', href: '/' },
  { label: 'Mazarrón', href: '/municipios/mazarron' },
  { label: 'Playa de El Rincón' },
]

describe('Breadcrumb', () => {
  it('marks the last item as the current page', () => {
    render(<Breadcrumb items={items} />)
    const current = screen.getByText('Playa de El Rincón')
    expect(current.getAttribute('aria-current')).toBe('page')
    expect(
      screen.getByRole('link', { name: 'Inicio' }).getAttribute('href'),
    ).toBe('/')
  })

  it('keeps links and the current item distinct on photos', () => {
    render(<Breadcrumb items={items} tone="onPhoto" />)
    const link = screen.getByRole('link', { name: 'Mazarrón' })
    const current = screen.getByText('Playa de El Rincón')
    expect(link.className).toContain('underline')
    expect(current.className).toContain('font-semibold')
    expect(current.className).not.toContain('underline')
  })
})
