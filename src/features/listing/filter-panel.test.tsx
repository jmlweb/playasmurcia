import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import type { BeachSearchParams } from '@/lib/beach-filters'
import type { Activity, Beach, Tag } from '@/types/beach'

import { FilterPanel } from './filter-panel'

const makeBeach = (
  name: string,
  activities: number[],
  tags: number[] = [],
): Beach => ({
  code: name,
  name,
  municipality: 0,
  sea: 0,
  coordinates: [37.5, -1.2],
  soilType: 'arena',
  nudist: false,
  promenade: false,
  anchorageZone: false,
  dogFriendly: false,
  lifeguard: false,
  services: [],
  activities,
  tags,
  description: '',
  access: '',
  nearby: [],
  orientation: 'sur',
  instagramHashtag: '',
  recommendationScore: 0,
})

const activities: Activity[] = [
  { id: 'swimming', name: 'Natación', icon: '🏊' },
  { id: 'fishing', name: 'Pesca', icon: '🎣' },
  { id: 'diving', name: 'Buceo', icon: '🫧' },
]

const tags: Tag[] = [{ id: 'snorkel', name: 'Snorkel' }]

const beaches: Beach[] = [
  makeBeach('a', [0, 2], [0]),
  makeBeach('b', [0]),
  makeBeach('c', [1]),
]

const renderPanel = (filters: BeachSearchParams = {}) =>
  render(
    <FilterPanel
      activities={activities}
      beaches={beaches}
      filters={filters}
      flagGreenAvailable={false}
      mobileOpen={false}
      municipalities={[{ id: 'm', name: 'Municipio', slug: 'm' } as never]}
      resultCount={beaches.length}
      seas={[{ id: 's', name: 'Mediterráneo' } as never]}
      services={[]}
      tags={tags}
      onChange={vi.fn()}
      onMobileClose={vi.fn()}
    />,
  )

beforeAll(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: true,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

describe('FilterPanel activities', () => {
  it('does not offer activities that are listed on nearly every beach', () => {
    renderPanel()
    expect(screen.queryByText('Natación')).toBeNull()
    expect(screen.queryByText('Pesca')).toBeNull()
    expect(screen.getByText('Buceo')).toBeTruthy()
  })

  it('keeps an unlisted activity visible while it is selected', () => {
    renderPanel({ activities: [1] })
    expect(screen.getByText('Pesca')).toBeTruthy()
  })

  it('offers the Snorkel tag now that the Snorkel activity is not offered', () => {
    renderPanel()
    expect(screen.getByText('Snorkel')).toBeTruthy()
  })
})
