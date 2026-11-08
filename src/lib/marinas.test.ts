import { describe, expect, it } from 'vitest'

import { getMarinas, getNearestMarina } from './marinas'

describe('getNearestMarina', () => {
  it('lists 19 marinas with coordinates on the Murcia coast', () => {
    const marinas = getMarinas()
    expect(marinas).toHaveLength(19)
    marinas.forEach((marina) => {
      expect(marina.coordinates[0]).toBeGreaterThan(37.3)
      expect(marina.coordinates[0]).toBeLessThan(37.9)
      expect(marina.coordinates[1]).toBeGreaterThan(-1.7)
      expect(marina.coordinates[1]).toBeLessThan(-0.6)
    })
  })

  it('finds Cabo de Palos for Playa de Levante', () => {
    const nearest = getNearestMarina([37.6342, -0.7033])
    expect(nearest?.name).toBe('Puerto Deportivo de Cabo de Palos')
    expect(nearest?.distanceKm).toBeLessThan(0.5)
  })

  it('returns nothing for a beach far from every marina', () => {
    // Cala Cerrada in Cabo Tiñoso is 15 km from Cartagena and Mazarrón
    expect(getNearestMarina([37.54, -1.12], 10)).toBeUndefined()
  })
})
