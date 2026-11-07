import L from 'leaflet'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { mapboxAttribution, markerIcon, removeLeafletMap } from './leaflet-map'
import { mapPinDataUrl } from './map-pin'

const LEAFLET_ZOOM_TIMER_MS = 250

// jsdom has no CSS transforms, so Leaflet never starts this animation by itself
function createMapMidZoom() {
  const map = L.map(document.createElement('div'), {
    center: [37.7, -1],
    zoom: 9,
  })
  const animated = map as L.Map & {
    _animateZoom: (center: L.LatLng, zoom: number, start: boolean) => void
  }
  animated._animateZoom(map.getCenter(), 10, true)
  return map
}

describe('markerIcon', () => {
  it('uses the brand pin instead of the Leaflet default', () => {
    expect(markerIcon.options.iconUrl).toBe(mapPinDataUrl)
    expect(markerIcon.options.iconUrl).not.toContain('marker-icon')
  })
})

describe('mapboxAttribution', () => {
  it('credits Mapbox and OpenStreetMap', () => {
    expect(mapboxAttribution).toContain('Mapbox')
    expect(mapboxAttribution).toContain('OpenStreetMap')
  })
})

describe('removeLeafletMap', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('survives the zoom timer that outlives the map', () => {
    vi.useFakeTimers()
    const map = createMapMidZoom()

    removeLeafletMap(map)

    expect(() => {
      vi.advanceTimersByTime(LEAFLET_ZOOM_TIMER_MS)
    }).not.toThrow()
  })

  it('frees its container for a new map', () => {
    const container = document.createElement('div')
    const map = L.map(container, { center: [37.7, -1], zoom: 9 })

    removeLeafletMap(map)

    expect(() => L.map(container)).not.toThrow()
  })
})
