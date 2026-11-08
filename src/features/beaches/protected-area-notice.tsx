import type { ProtectedArea } from '@/lib/protected-areas'

import { getProtectedAreas, protectedAreasSource } from '@/lib/protected-areas'

type ProtectedAreaNoticeProps = {
  beachCode: string
}

// Source figures as the CARM layers write them, in readable Spanish
const DESIGNATION_LABELS: Record<string, string> = {
  'Parque Regional': 'Parque regional',
  'Paisaje Protegido': 'Paisaje protegido',
  'Reserva Natural': 'Reserva natural',
  'Monumento Natural': 'Monumento natural',
  'Sin figura asignada (Propuesto Parque Regional)':
    'Espacio natural protegido, propuesto como parque regional',
  'Sin figura asignada (Propuesto Paisaje Protegido)':
    'Espacio natural protegido, propuesto como paisaje protegido',
  'Sin figura asignada': 'Espacio natural protegido',
  LIC: 'Lugar de Importancia Comunitaria (LIC)',
  ZEC: 'Zona Especial de Conservación (ZEC)',
  ZEPA: 'Zona de Especial Protección para las Aves (ZEPA)',
}

const designationLabel = (area: ProtectedArea) => {
  const label = DESIGNATION_LABELS[area.designation] ?? area.designation
  return area.network === 'natura2000' ? `${label}, Red Natura 2000` : label
}

const retrievedOnLabel = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${protectedAreasSource.retrievedOn}T00:00:00Z`))

/**
 * Regional protected spaces first, then the Natura 2000 sites that overlap
 * them, so the park a visitor knows by name leads the list.
 */
export function ProtectedAreaNotice({ beachCode }: ProtectedAreaNoticeProps) {
  const areas = [...getProtectedAreas(beachCode)].sort(
    (first, second) =>
      Number(first.network === 'natura2000') -
      Number(second.network === 'natura2000'),
  )
  if (areas.length === 0) return null

  return (
    <div
      className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-gray-900"
      role="note"
    >
      <p className="font-semibold">Espacio natural protegido</p>
      <ul className="mt-1 space-y-1">
        {areas.map((area) => (
          <li key={area.code}>
            <span className="font-medium">{area.name}</span>
            {' · '}
            {designationLabel(area)}{' '}
            <span className="text-gray-600">({area.code})</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-gray-700">
        Fuente:{' '}
        <a
          className="underline decoration-gray-400 underline-offset-2 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none"
          href={protectedAreasSource.viewerUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          IDERM, Comunidad Autónoma de la Región de Murcia
        </a>
        , límites consultados el {retrievedOnLabel}.
      </p>
    </div>
  )
}
