import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import L from 'leaflet'
import 'leaflet.markercluster'
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

// flex! because Leaflet's unlayered `.leaflet-marker-icon { display: block }`
// beats Tailwind's layered utilities
const ClusterClass =
  'flex! items-center justify-center rounded-full bg-ocean-600 text-sm font-semibold text-white tabular-nums shadow-md ring-2 ring-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-500'

function clusterIcon(cluster: L.MarkerCluster) {
  const count = cluster.getChildCount()
  return L.divIcon({
    className: ClusterClass,
    iconSize: L.point(44, 44),
    html: `<span aria-hidden="true">${count}</span><span class="sr-only">${count} playas, ampliar zona</span>`,
  })
}

export function ExplorerMap({ markers }: { markers: ExplorerMapMarker[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.MarkerClusterGroup | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const map = L.map(containerRef.current, {
      center: [37.7, -1.0],
      zoom: 9,
      scrollWheelZoom: false,
      // One finger keeps scrolling the page; two fingers move the map
      dragging: !window.matchMedia('(pointer: coarse)').matches,
    })
    L.tileLayer(mapboxUrl, {
      attribution: mapboxAttribution,
      maxZoom: 19,
      detectRetina: true,
    }).addTo(map)
    layerRef.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      iconCreateFunction: clusterIcon,
    }).addTo(map)
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
      L.marker(marker.coordinates, {
        alt: marker.name,
        icon: markerIcon,
        title: marker.name,
      })
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
    <>
      <div
        ref={containerRef}
        aria-label="Mapa de playas"
        className="z-0 w-full overflow-hidden rounded-2xl ring-1 ring-gray-200/60"
        role="region"
        style={{ height: 'min(640px, 70vh)' }}
      />
      <p className="mt-2 hidden text-sm text-gray-600 pointer-coarse:block">
        Usa dos dedos para mover el mapa.
      </p>
    </>
  )
}
