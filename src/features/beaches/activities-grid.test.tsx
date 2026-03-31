import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Activity } from '@/types/beach'

import { ActivitiesGrid } from './activities-grid'

const mockActivities: Activity[] = [
  { id: 'surf', name: 'Surf', icon: '🏄' },
  { id: 'snorkel', name: 'Snorkel', icon: '🤿' },
  { id: 'kayak', name: 'Kayak', icon: '🚣' },
]

describe('ActivitiesGrid', () => {
  it('renders nothing when no activities are provided', () => {
    const { container } = render(
      <ActivitiesGrid activityIndices={[]} allActivities={mockActivities} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the activities heading', () => {
    render(
      <ActivitiesGrid activityIndices={[0]} allActivities={mockActivities} />,
    )
    expect(screen.getByRole('heading', { name: 'Actividades' })).toBeTruthy()
  })

  it('renders the correct activities by index', () => {
    render(
      <ActivitiesGrid
        activityIndices={[1, 2]}
        allActivities={mockActivities}
      />,
    )
    expect(screen.getByText('Snorkel')).toBeTruthy()
    expect(screen.getByText('Kayak')).toBeTruthy()
    expect(screen.queryByText('Surf')).toBeNull()
  })

  it('skips out-of-bounds indices gracefully', () => {
    render(
      <ActivitiesGrid
        activityIndices={[0, 50]}
        allActivities={mockActivities}
      />,
    )
    expect(screen.getByText('Surf')).toBeTruthy()
  })
})
