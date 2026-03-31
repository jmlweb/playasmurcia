import type { JSX } from 'react'

import { BlueFlagCertIcon, LeafIcon } from '@/components/ui/icons'
import type { Certification } from '@/types/beach'

const CertificationConfig: Record<
  Certification,
  {
    label: string
    description: string
    colorClass: string
    icon: (p: { className?: string }) => JSX.Element
  }
> = {
  'blue-flag': {
    label: 'Bandera Azul',
    description: 'Certificación internacional de calidad ambiental y servicios',
    colorClass: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: BlueFlagCertIcon,
  },
  'q-quality': {
    label: 'Q de Calidad',
    description: 'Distintivo de calidad turística de las playas españolas',
    colorClass: 'bg-yellow-50 border-yellow-200 text-yellow-800',
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
    colorClass: 'bg-green-50 border-green-200 text-green-800',
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
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Certificaciones
      </h2>
      <ul className="flex flex-wrap gap-3">
        {certifications.map((cert) => {
          const config = CertificationConfig[cert]
          return (
            <li
              key={cert}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 ${config.colorClass}`}
              title={config.description}
            >
              <config.icon className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">{config.label}</p>
                <p className="text-xs opacity-75">{config.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
