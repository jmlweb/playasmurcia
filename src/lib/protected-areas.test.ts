import { describe, expect, it } from 'vitest'

import type { AreaGeometry, ProtectedAreaFeature } from './protected-areas'

import beaches from '../../data/beaches.json'
import {
  distanceToGeometryMeters,
  findContainingAreas,
  getProtectedAreas,
  isPointInGeometry,
  protectedAreasSource,
} from './protected-areas'

// A 10 × 10 square with a 2 × 2 hole in the middle, in [lng, lat] order
const squareWithHole: AreaGeometry = {
  type: 'Polygon',
  coordinates: [
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ],
    [
      [4, 4],
      [6, 4],
      [6, 6],
      [4, 6],
      [4, 4],
    ],
  ],
}

const twoIslands: AreaGeometry = {
  type: 'MultiPolygon',
  coordinates: [
    [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ],
    [
      [
        [5, 5],
        [6, 5],
        [6, 6],
        [5, 6],
        [5, 5],
      ],
    ],
  ],
}

describe('isPointInGeometry', () => {
  it('finds a point inside a polygon and outside its hole', () => {
    expect(isPointInGeometry([2, 2], squareWithHole)).toBe(true)
    expect(isPointInGeometry([5, 5], squareWithHole)).toBe(false)
    expect(isPointInGeometry([11, 5], squareWithHole)).toBe(false)
  })

  it('checks every part of a multipolygon', () => {
    expect(isPointInGeometry([0.5, 0.5], twoIslands)).toBe(true)
    expect(isPointInGeometry([5.5, 5.5], twoIslands)).toBe(true)
    expect(isPointInGeometry([3, 3], twoIslands)).toBe(false)
  })
})

describe('distanceToGeometryMeters', () => {
  // A 0.01° square on the Murcia coast, in [lng, lat] order
  const coastSquare: AreaGeometry = {
    type: 'Polygon',
    coordinates: [
      [
        [-1, 37.6],
        [-0.99, 37.6],
        [-0.99, 37.61],
        [-1, 37.61],
        [-1, 37.6],
      ],
    ],
  }

  it('measures the gap to the nearest edge in metres', () => {
    // 0.0005° of latitude is about 55 m
    const distance = distanceToGeometryMeters([-0.995, 37.5995], coastSquare)
    expect(distance).toBeGreaterThan(50)
    expect(distance).toBeLessThan(60)
  })

  it('is zero inside the geometry', () => {
    expect(distanceToGeometryMeters([-0.995, 37.605], coastSquare)).toBe(0)
  })
})

describe('findContainingAreas', () => {
  const park: ProtectedAreaFeature = {
    area: {
      code: 'ENP1',
      name: 'Parque',
      designation: 'Parque Regional',
      network: 'enp',
    },
    geometry: squareWithHole,
  }
  const parkSecondPart: ProtectedAreaFeature = {
    area: park.area,
    geometry: twoIslands,
  }
  const site: ProtectedAreaFeature = {
    area: {
      code: 'ES1',
      name: 'Sitio',
      designation: 'ZEC',
      network: 'natura2000',
    },
    geometry: twoIslands,
  }

  it('takes beach coordinates as [lat, lng] and lists each area once', () => {
    // lat 0.5, lng 0.5 sits in the park square and in the first island
    expect(
      findContainingAreas([0.5, 0.5], [park, parkSecondPart, site]),
    ).toEqual([park.area, site.area])
  })

  it('accepts a beach just outside an area when within the tolerance', () => {
    const coast: ProtectedAreaFeature = {
      area: {
        code: 'C',
        name: 'Costa',
        designation: 'Parque Regional',
        network: 'enp',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-1, 37.6],
            [-0.99, 37.6],
            [-0.99, 37.61],
            [-1, 37.61],
            [-1, 37.6],
          ],
        ],
      },
    }
    // About 33 m south of the southern edge
    const beach = [37.5997, -0.995] as const
    expect(findContainingAreas(beach, [coast])).toEqual([])
    expect(findContainingAreas(beach, [coast], 50)).toEqual([coast.area])
    expect(findContainingAreas(beach, [coast], 20)).toEqual([])
  })

  it('does not swap latitude and longitude', () => {
    const tall: ProtectedAreaFeature = {
      area: {
        code: 'T',
        name: 'Tall',
        designation: 'LIC',
        network: 'natura2000',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 10],
            [0, 10],
            [0, 0],
          ],
        ],
      },
    }
    // lng 0.5, lat 8 is inside; lng 8, lat 0.5 is not
    expect(findContainingAreas([8, 0.5], [tall])).toEqual([tall.area])
    expect(findContainingAreas([0.5, 8], [tall])).toEqual([])
  })
})

describe('protected-areas.json', () => {
  const codes = new Set(beaches.map((beach) => beach.code))

  it('records the source layers, the retrieval date and the marine sites left out', () => {
    expect(protectedAreasSource.retrievedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(protectedAreasSource.layers.map((layer) => layer.typeName)).toEqual([
      'SIG_LUP_SITES_CARM:ENP',
      'SIG_LUP_SITES_CARM:LIC-ZEC',
      'SIG_LUP_SITES_CARM:ZEPA',
    ])
    protectedAreasSource.layers.forEach((layer) => {
      expect(layer.featureCount).toBeGreaterThan(0)
      expect(layer.version.length).toBeGreaterThan(0)
    })
    expect(protectedAreasSource.excludedMarineSites).toContain('ES6200029')
    expect(protectedAreasSource.toleranceMeters).toBe(50)
  })

  it('places the Calblanque beaches in the regional park and its ZEC', () => {
    const calaArturo = getProtectedAreas('516').map((area) => area.code)
    expect(calaArturo).toContain('ENP000005')
    expect(calaArturo).toContain('ES6200001')
  })

  it('stores a name, a code and a network for every area of real beaches', () => {
    const listed = beaches.filter(
      (beach) => getProtectedAreas(beach.code).length,
    )
    expect(listed.length).toBeGreaterThan(40)
    listed.forEach((beach) => {
      expect(codes.has(beach.code)).toBe(true)
      getProtectedAreas(beach.code).forEach((area) => {
        expect(area.code, beach.name).toMatch(/^(ENP|EN|ES)\d{6,7}$/)
        expect(area.name.length, beach.name).toBeGreaterThan(0)
        expect(['enp', 'natura2000']).toContain(area.network)
        expect(
          protectedAreasSource.excludedMarineSites,
          beach.name,
        ).not.toContain(area.code)
      })
    })
  })

  it('returns no areas for a beach outside every protected space', () => {
    expect(getProtectedAreas('000')).toEqual([])
  })
})
