import type { AccessibilitySheet } from '@/lib/accessibility'

import { accessibilitySource } from '@/lib/accessibility'

type AccessibilityPanelProps = {
  sheet: AccessibilitySheet
}

const BathingLabels = {
  staff:
    'Baño asistido: personal de la playa acompaña al baño en silla anfibia',
  loan: 'Préstamo de silla anfibia; hace falta ir con acompañante para el baño',
  none: 'Sin ayuda al baño',
} as const

const linkClass =
  'rounded text-ocean-600 hover:text-ocean-700 hover:underline focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none'

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1)

/** FAMDIF accessibility sheet, shown as facts with the season they describe */
export function AccessibilityPanel({ sheet }: AccessibilityPanelProps) {
  const equipment = [
    sheet.amphibiousChairs !== undefined && sheet.amphibiousChairs > 0
      ? `${String(sheet.amphibiousChairs)} ${sheet.amphibiousChairs === 1 ? 'silla anfibia' : 'sillas anfibias'}`
      : undefined,
    sheet.amphibiousCrutches !== undefined && sheet.amphibiousCrutches > 0
      ? `${String(sheet.amphibiousCrutches)} ${sheet.amphibiousCrutches === 1 ? 'par de muletas anfibias' : 'pares de muletas anfibias'}`
      : undefined,
    sheet.walkway ? 'pasarela sobre la arena' : undefined,
    sheet.adaptedToilets ? 'aseo adaptado' : undefined,
    sheet.adaptedChangingRooms ? 'vestuario adaptado' : undefined,
    sheet.adaptedShade ? 'zona de sombra adaptada' : undefined,
    sheet.adaptedBathingZone
      ? 'zona de baño adaptada dentro del agua, con pasamanos y asientos'
      : undefined,
  ].filter((item): item is string => item !== undefined)

  return (
    <section aria-labelledby="accesibilidad-heading">
      <h2
        className="mb-4 text-3xl font-normal tracking-tight text-gray-900"
        id="accesibilidad-heading"
      >
        Accesibilidad
      </h2>
      <dl className="space-y-3 text-gray-700">
        <div>
          <dt className="text-sm text-gray-600">
            Valoración FAMDIF ({String(sheet.year)})
          </dt>
          <dd className="font-medium text-gray-900">
            {capitalize(sheet.category)}
          </dd>
        </div>
        {sheet.assistedBathing && (
          <div>
            <dt className="text-sm text-gray-600">Ayuda al baño</dt>
            <dd className="font-medium text-gray-900">
              {BathingLabels[sheet.assistedBathing]}
            </dd>
            {sheet.season && (
              <dd className="text-sm">Temporada: {sheet.season}</dd>
            )}
            {sheet.hours && <dd className="text-sm">Horario: {sheet.hours}</dd>}
          </div>
        )}
        {equipment.length > 0 && (
          <div>
            <dt className="text-sm text-gray-600">Equipamiento</dt>
            <dd className="font-medium text-gray-900">
              {capitalize(equipment.join(', '))}.
            </dd>
          </div>
        )}
      </dl>
      <p className="mt-4 text-sm text-gray-600">
        Fuente:{' '}
        <a
          className={linkClass}
          href={sheet.sourceUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          ficha de accesibilidad de ITREM
        </a>{' '}
        (datos de campo FAMDIF, temporada {String(sheet.year)}; consultada el{' '}
        {accessibilitySource.fetchedOn}).
        {sheet.imagesUrl && (
          <>
            {' '}
            <a
              className={linkClass}
              href={sheet.imagesUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Imágenes de los accesos (PDF)
            </a>
            .
          </>
        )}
      </p>
    </section>
  )
}
