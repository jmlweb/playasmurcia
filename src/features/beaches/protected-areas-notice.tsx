import type { ProtectedAreas } from '@/lib/protected-areas'

import {
  NaturaTypeLabels,
  isMarineSite,
  protectedAreasSources,
} from '@/lib/protected-areas'

type ProtectedAreasNoticeProps = {
  areas: ProtectedAreas
}

const linkClass =
  'underline decoration-gray-400 underline-offset-2 hover:text-ocean-700 focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:outline-none'

const joinNames = (items: string[]) =>
  items.length <= 1
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`

/** Regional protected spaces and Natura 2000 sites the beach sits in, with the sea apart */
export function ProtectedAreasNotice({ areas }: ProtectedAreasNoticeProps) {
  const landSites = areas.natura2000.filter((site) => !isMarineSite(site))
  const marineSites = areas.natura2000.filter(isMarineSite)
  if (
    areas.regional.length === 0 &&
    landSites.length === 0 &&
    marineSites.length === 0
  ) {
    return null
  }

  const natura = (sites: typeof landSites) =>
    joinNames(
      sites.map(
        (site) => `${site.name} (${NaturaTypeLabels[site.type]} ${site.code})`,
      ),
    )

  return (
    <p
      className="rounded-xl bg-ocean-50 px-4 py-3 text-sm text-gray-900"
      role="note"
    >
      <span className="font-semibold">Espacio protegido.</span>{' '}
      {areas.regional.length > 0 && (
        <>
          La playa está en un espacio natural protegido:{' '}
          {joinNames(
            areas.regional.map((site) => `${site.figure} ${site.name}`),
          )}
          .{' '}
        </>
      )}
      {landSites.length > 0 && <>Red Natura 2000: {natura(landSites)}. </>}
      {marineSites.length > 0 && (
        <>Las aguas frente a la playa forman parte de {natura(marineSites)}. </>
      )}
      <span className="text-gray-600">
        Fuentes:{' '}
        <a
          className={linkClass}
          href={protectedAreasSources.regional.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          Comunidad Autónoma de la Región de Murcia
        </a>{' '}
        y{' '}
        <a
          className={linkClass}
          href={protectedAreasSources.natura2000.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          Agencia Europea de Medio Ambiente (Natura 2000, fin de 2024)
        </a>
        , con un margen de {String(protectedAreasSources.bufferMetres)} m
        alrededor de las coordenadas de la playa.
      </span>
    </p>
  )
}
