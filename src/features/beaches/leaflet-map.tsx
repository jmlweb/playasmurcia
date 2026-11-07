import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef } from 'react'

import {
  MAP_PIN_HEIGHT,
  MAP_PIN_WIDTH,
  mapPinDataUrl,
} from '@/features/beaches/map-pin'
import { MAPBOX_STYLE } from '@/features/beaches/map-style'

export const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/${MAPBOX_STYLE}/tiles/512/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`

// The attribution Mapbox requires for its styles; short enough for one line
// on a 375px map
export const mapboxAttribution =
  '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> <a href="https://apps.mapbox.com/feedback/">Mejorar este mapa</a>'

export const markerIcon = L.icon({
  iconUrl: mapPinDataUrl,
  iconSize: [MAP_PIN_WIDTH, MAP_PIN_HEIGHT],
  iconAnchor: [MAP_PIN_WIDTH / 2, MAP_PIN_HEIGHT - 1],
  popupAnchor: [0, -MAP_PIN_HEIGHT],
})

/**
 * Every animated zoom in Leaflet 1.9.4 arms a 250 ms timer that `remove()` does
 * not clear, and that timer throws once the panes are gone. Lowering the private
 * flag makes it return early, so zooms can stay animated.
 */
export function removeLeafletMap(map: L.Map) {
  Object.assign(map, { _animatingZoom: false })
  map.remove()
}

type LeafletMapProps = {
  coordinates: [number, number]
  beachName: string
}

export function LeafletMap({ coordinates, beachName }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const [lat, lng] = coordinates
    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false,
      zoomControl: false,
      // One finger keeps scrolling the page, as in the explorer map
      dragging: !window.matchMedia('(pointer: coarse)').matches,
    })

    // Map credits only: the Leaflet prefix would push the required Mapbox
    // attribution onto a second line at 375px
    map.attributionControl.setPrefix(false)

    L.control
      .zoom({ zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' })
      .addTo(map)

    const FullscreenControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd() {
        const btn = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
        const a = L.DomUtil.create('a', '', btn)
        a.href = '#'
        a.title = 'Pantalla completa'
        a.setAttribute('role', 'button')
        a.setAttribute('aria-label', 'Pantalla completa')
        a.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>'
        a.style.cssText =
          'display:flex;align-items:center;justify-content:center;cursor:pointer'

        L.DomEvent.disableClickPropagation(btn)
        L.DomEvent.on(a, 'click', (e) => {
          L.DomEvent.preventDefault(e)
          const container = map.getContainer()
          if (document.fullscreenElement) {
            void document.exitFullscreen()
          } else {
            void container.requestFullscreen()
          }
        })
        return btn
      },
    })

    map.addControl(new FullscreenControl())

    map.getContainer().addEventListener('fullscreenchange', () => {
      map.invalidateSize()
    })

    L.tileLayer(mapboxUrl, {
      attribution: mapboxAttribution,
      maxZoom: 19,
      detectRetina: true,
    }).addTo(map)

    L.marker([lat, lng], {
      icon: markerIcon,
      alt: `Ubicación de ${beachName}`,
    })
      .addTo(map)
      .bindPopup(beachName)

    // Credits stay visible and clickable, but keyboard users should not have to
    // tab through them to leave the map
    map
      .getContainer()
      .querySelectorAll('.leaflet-control-attribution a')
      .forEach((link) => {
        link.setAttribute('tabindex', '-1')
      })

    mapInstance.current = map

    return () => {
      removeLeafletMap(map)
      mapInstance.current = null
    }
  }, [coordinates, beachName])

  return (
    <div
      ref={mapRef}
      aria-label={`Mapa de ${beachName}`}
      className="z-0 w-full"
      role="region"
      style={{
        height: 'min(360px, 60vh)',
      }}
    />
  )
}
