import { describe, expect, it } from 'vitest'

import beaches from '../../data/beaches.json'
import services from '../../data/services.json'

// Sunbeds and umbrellas were guessed by an LLM from descriptions (TSK-198); keep them only where the beach text backs them
const serviceIndex = (id: string) =>
  services.findIndex((service) => service.id === id)

const SUNBEDS = serviceIndex('sunbeds')
const UMBRELLAS = serviceIndex('umbrellas')
const LA_REYA_CODE = '648'

const beachText = (beach: (typeof beaches)[number]) =>
  `${beach.description} ${beach.access ?? ''}`

// JSON inference types beaches with no services as never[], so widen before includes
const servicesOf = (beach: (typeof beaches)[number]): readonly number[] =>
  beach.services

const beachesWithService = (index: number) =>
  beaches.filter((beach) => servicesOf(beach).includes(index))

describe('rental services in data/beaches.json', () => {
  it('lists sunbeds only on the 7 beaches whose text mentions hamacas', () => {
    const withSunbeds = beachesWithService(SUNBEDS)

    expect(withSunbeds).toHaveLength(7)
    for (const beach of withSunbeds) {
      expect(beachText(beach), beach.name).toMatch(/hamaca/i)
    }
  })

  it('lists umbrellas only on the 2 beaches whose text mentions sombrillas', () => {
    const withUmbrellas = beachesWithService(UMBRELLAS)

    expect(withUmbrellas).toHaveLength(2)
    for (const beach of withUmbrellas) {
      expect(beachText(beach), beach.name).toMatch(/sombrilla/i)
    }
  })

  it('does not list sunbeds at La Reya (Junta de los Mares)', () => {
    const laReya = beaches.find((beach) => beach.code === LA_REYA_CODE)

    expect(laReya?.name).toMatch(/La Reya/)
    expect(laReya && servicesOf(laReya)).not.toContain(SUNBEDS)
  })
})
