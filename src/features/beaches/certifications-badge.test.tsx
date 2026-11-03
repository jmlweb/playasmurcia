import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CertificationsBadge } from './certifications-badge'

describe('CertificationsBadge', () => {
  it('renders nothing when no certifications are provided', () => {
    const { container } = render(<CertificationsBadge certifications={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the certifications heading', () => {
    render(<CertificationsBadge certifications={['blue-flag']} />)
    expect(
      screen.getByRole('heading', { name: 'Certificaciones' }),
    ).toBeTruthy()
  })

  it('renders blue-flag certification', () => {
    render(<CertificationsBadge certifications={['blue-flag']} />)
    expect(screen.getByText('Bandera Azul')).toBeTruthy()
  })

  it('renders q-quality certification', () => {
    render(<CertificationsBadge certifications={['q-quality']} />)
    expect(screen.getByText('Q de Calidad')).toBeTruthy()
  })

  it('renders ecoplayas certification', () => {
    render(<CertificationsBadge certifications={['ecoplayas']} />)
    expect(screen.getByText('Ecoplayas')).toBeTruthy()
  })

  it('renders multiple certifications', () => {
    render(
      <CertificationsBadge
        certifications={['blue-flag', 'q-quality', 'ecoplayas']}
      />,
    )
    expect(screen.getByText('Bandera Azul')).toBeTruthy()
    expect(screen.getByText('Q de Calidad')).toBeTruthy()
    expect(screen.getByText('Ecoplayas')).toBeTruthy()
  })

  it('shows the award season year for each certification list', () => {
    render(<CertificationsBadge certifications={['blue-flag', 'q-quality']} />)
    expect(screen.getByText('Temporada 2026')).toBeTruthy()
    expect(screen.getByText('Temporada 2024')).toBeTruthy()
  })

  it('omits the season year when it is unknown', () => {
    render(<CertificationsBadge certifications={['ecoplayas']} />)
    expect(screen.queryByText(/^Temporada/)).toBeNull()
  })
})
