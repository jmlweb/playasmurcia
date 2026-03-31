export const OccupancyStyles = {
  low: {
    label: 'Baja ocupación',
    shortLabel: 'Baja',
    solid: 'bg-teal-700 text-teal-100',
    subtle: 'text-teal-700 bg-teal-50 ring-1 ring-teal-200',
  },
  medium: {
    label: 'Ocupación media',
    shortLabel: 'Media',
    solid: 'bg-amber-700 text-amber-100',
    subtle: 'text-amber-700 bg-amber-50 ring-1 ring-amber-200',
  },
  high: {
    label: 'Alta ocupación',
    shortLabel: 'Alta',
    solid: 'bg-rose-700 text-rose-100',
    subtle: 'text-rose-700 bg-rose-50 ring-1 ring-rose-200',
  },
} as const

export const AccessDifficultyStyles = {
  easy: {
    label: 'Fácil',
    subtle: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200',
  },
  moderate: {
    label: 'Moderado',
    subtle: 'text-amber-700 bg-amber-50 ring-1 ring-amber-200',
  },
  hard: {
    label: 'Difícil',
    subtle: 'text-rose-700 bg-rose-50 ring-1 ring-rose-200',
  },
} as const

export const WaterQualityStyles = {
  excellent: {
    label: 'Excelente',
    subtle: 'text-blue-700 bg-blue-50 ring-1 ring-blue-200',
  },
  good: {
    label: 'Buena',
    subtle: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200',
  },
  sufficient: {
    label: 'Suficiente',
    subtle: 'text-amber-700 bg-amber-50 ring-1 ring-amber-200',
  },
  poor: {
    label: 'Insuficiente',
    subtle: 'text-rose-700 bg-rose-50 ring-1 ring-rose-200',
  },
} as const
