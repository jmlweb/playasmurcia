import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import { useEffect, useRef } from 'react'

type LeafletMapProps = {
  coordinates: [number, number]
  beachName: string
}

// Fix default marker icon paths (Leaflet bundles them as separate files)
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function LeafletMap({
  coordinates,
  beachName,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const [lat, lng] = coordinates
    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    L.marker([lat, lng], { icon: markerIcon })
      .addTo(map)
      .bindPopup(beachName)

    mapInstance.current = map

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [coordinates, beachName])

  return (
    <div
      ref={mapRef}
      className="z-0 w-full"
      style={{
        height: 'min(360px, 60vh)',
      }}
    />
  )
}
