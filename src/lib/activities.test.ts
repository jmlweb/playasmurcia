import { describe, expect, it } from 'vitest'

import type { Activity } from '@/types/beach'

import activities from '../../data/activities.json'
import beaches from '../../data/beaches.json'
import { isListedActivity, listedActivityIndices } from './activities'

const catalog = activities as Activity[]

const beachCountWith = (activityIndex: number) =>
  beaches.filter((beach) => beach.activities.includes(activityIndex)).length

describe('isListedActivity', () => {
  it.each(['swimming', 'kayak', 'snorkeling', 'fishing'])(
    'does not list %s',
    (id) => {
      expect(isListedActivity({ id, name: id, icon: '' })).toBe(false)
    },
  )

  it.each(['paddleboard', 'diving', 'sailing', 'windsurf', 'kitesurf'])(
    'lists %s',
    (id) => {
      expect(isListedActivity({ id, name: id, icon: '' })).toBe(true)
    },
  )
})

describe('listedActivityIndices', () => {
  it('keeps only listed activities, in the beach order', () => {
    const swimming = catalog.findIndex((a) => a.id === 'swimming')
    const diving = catalog.findIndex((a) => a.id === 'diving')
    const volleyball = catalog.findIndex((a) => a.id === 'volleyball')

    expect(
      listedActivityIndices([volleyball, swimming, diving], catalog),
    ).toEqual([volleyball, diving])
  })

  it('drops indices that are not in the catalogue', () => {
    expect(listedActivityIndices([99], catalog)).toEqual([])
  })
})

describe('listed activities against data/beaches.json', () => {
  const listed = catalog
    .map((activity, index) => ({ activity, index }))
    .filter(({ activity }) => isListedActivity(activity))

  it.each(listed.map(({ activity, index }) => [activity.name, index]))(
    '%s is on at most two thirds of the beaches',
    (_name, index) => {
      expect(beachCountWith(index)).toBeLessThanOrEqual(
        (beaches.length * 2) / 3,
      )
    },
  )

  it('no listed activity applies to every beach', () => {
    const universal = listed.filter(
      ({ index }) => beachCountWith(index) === beaches.length,
    )
    expect(universal).toEqual([])
  })
})
