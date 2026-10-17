import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef } from 'react'

import {
  mapboxAttribution,
  mapboxUrl,
  markerIcon,
} from '@/features/beaches/leaflet-map'

export type ExplorerMapMarker = {
  code: string
  name: string
  slug: string
  coordinates: [number, number]
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function ExplorerMap({ markers }: { markers: ExplorerMapMarker[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const map = L.map(containerRef.current, {
      center: [37.7, -1.0],
      zoom: 9,
      scrollWheelZoom: false,
    })
    L.tileLayer(mapboxUrl, {
      attribution: mapboxAttribution,
      maxZoom: 19,
      detectRetina: true,
    }).addTo(map)
    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      layerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return
    layer.clearLayers()
    for (const marker of markers) {
      L.marker(marker.coordinates, { icon: markerIcon, title: marker.name })
        .bindPopup(
          `<a href="/playas/${encodeURIComponent(marker.slug)}">${escapeHtml(marker.name)}</a>`,
        )
        .addTo(layer)
    }
    if (markers.length > 0) {
      map.fitBounds(L.latLngBounds(markers.map((m) => m.coordinates)), {
        padding: [30, 30],
        maxZoom: 13,
      })
    }
  }, [markers])

  return (
    <div
      ref={containerRef}
      aria-label="Mapa de playas"
      className="z-0 w-full overflow-hidden rounded-2xl ring-1 ring-gray-200/60"
      role="region"
      style={{ height: 'min(640px, 70vh)' }}
    />
  )
}
