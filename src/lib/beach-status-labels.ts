import type { BeachFlag, SeaState } from '@/lib/beach-status-112'

export const FlagLabels: Record<BeachFlag, string> = {
  VERDE: 'Bandera verde',
  AMARILLA: 'Bandera amarilla',
  ROJA: 'Bandera roja',
  'PLAYA CERRADA': 'Playa cerrada',
  'SIN BANDERA': 'Sin bandera',
}

export const SeaStateLabels: Record<SeaState, string> = {
  BUENO: 'Mar en calma',
  REGULAR: 'Mar moderado',
  MALO: 'Mar agitado',
  'SIN ESTADO': 'Estado desconocido',
}

export const OFF_SEASON_FLAG_NOTE =
  'Bandera del 112: se publica de junio a septiembre.'
