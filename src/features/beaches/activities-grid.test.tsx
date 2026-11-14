import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Activity } from '@/types/beach'

import { ActivitiesGrid } from './activities-grid'

const mockActivities: Activity[] = [
  { id: 'surf', name: 'Surf', icon: '🏄' },
  { id: 'diving', name: 'Buceo', icon: '🫧' },
  { id: 'sailing', name: 'Vela', icon: '⛵' },
  { id: 'swimming', name: 'Natación', icon: '🏊' },
  { id: 'kayak', name: 'Kayak', icon: '🛶' },
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
    expect(screen.getByText('Buceo')).toBeTruthy()
    expect(screen.getByText('Vela')).toBeTruthy()
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

  it('does not list activities that apply to every beach', () => {
    render(
      <ActivitiesGrid
        activityIndices={[1, 3, 4]}
        allActivities={mockActivities}
      />,
    )
    expect(screen.getByText('Buceo')).toBeTruthy()
    expect(screen.queryByText('Natación')).toBeNull()
    expect(screen.queryByText('Kayak')).toBeNull()
  })

  it('renders nothing when every activity is unlisted', () => {
    const { container } = render(
      <ActivitiesGrid
        activityIndices={[3, 4]}
        allActivities={mockActivities}
      />,
    )
    expect(container.firstChild).toBeNull()
  })
})
