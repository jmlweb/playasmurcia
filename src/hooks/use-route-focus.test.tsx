import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRouteFocus } from './use-route-focus'

const useRouterState = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-router', () => ({ useRouterState }))

const setLocation = (pathname: string, hash = '') => {
  useRouterState.mockReturnValue({ pathname, hash })
}

function Page() {
  useRouteFocus()
  return (
    <main>
      <h1>Cala Cortina</h1>
      <input id="buscar" />
    </main>
  )
}

describe('useRouteFocus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('leaves focus alone on first load', () => {
    setLocation('/playas/cala-cortina')
    render(<Page />)
    expect(document.activeElement).toBe(document.body)
  })

  it('moves focus to the h1 after a path change', () => {
    setLocation('/')
    const { rerender } = render(<Page />)
    setLocation('/playas/cala-cortina')
    rerender(<Page />)
    expect(document.activeElement?.tagName).toBe('H1')
  })

  it('prefers the element named by the hash', () => {
    setLocation('/')
    const { rerender } = render(<Page />)
    setLocation('/explorar', 'buscar')
    rerender(<Page />)
    expect(document.activeElement?.id).toBe('buscar')
  })

  it('focuses the hash target on first load', () => {
    setLocation('/explorar', 'buscar')
    render(<Page />)
    expect(document.activeElement?.id).toBe('buscar')
  })
})
