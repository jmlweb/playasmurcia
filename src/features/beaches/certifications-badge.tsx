import type { JSX } from 'react'

import type { Certification } from '@/types/beach'

import { BlueFlagCertIcon, LeafIcon } from '@/components/ui/icons'
import { getCertificationSeasonYear } from '@/lib/certification-seasons'

const CertificationConfig: Record<
  Certification,
  {
    label: string
    description: string
    icon: (p: { className?: string }) => JSX.Element
  }
> = {
  'blue-flag': {
    label: 'Bandera Azul',
    description: 'Certificación internacional de calidad ambiental y servicios',
    icon: BlueFlagCertIcon,
  },
  'q-quality': {
    label: 'Q de Calidad',
    description: 'Distintivo de calidad turística de las playas españolas',
    icon: ({ className }) => (
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center text-sm font-bold ${className ?? ''}`}
      >
        Q
      </span>
    ),
  },
  ecoplayas: {
    label: 'Ecoplayas',
    description: 'Reconocimiento a la gestión medioambiental sostenible',
    icon: LeafIcon,
  },
}

type CertificationsBadgeProps = {
  certifications: Certification[]
}

export function CertificationsBadge({
  certifications,
}: CertificationsBadgeProps) {
  if (certifications.length === 0) {
    return null
  }

  return (
    <section aria-label="Certificaciones">
      <h2 className="mb-4 text-3xl font-normal tracking-tight text-gray-900">
        Certificaciones
      </h2>
      <ul className="flex flex-wrap gap-3">
        {certifications.map((cert) => {
          const config = CertificationConfig[cert]
          const seasonYear = getCertificationSeasonYear(cert)
          return (
            <li
              key={cert}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900"
            >
              <config.icon className="h-5 w-5 text-ocean-600" />
              <div>
                <p className="text-sm font-semibold">{config.label}</p>
                {seasonYear !== undefined && (
                  <p className="text-xs font-medium text-gray-700">
                    Temporada {seasonYear}
                  </p>
                )}
                <p className="text-xs text-gray-600">{config.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
