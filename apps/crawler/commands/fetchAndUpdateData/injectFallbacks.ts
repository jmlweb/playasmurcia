import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

import { RawBeach } from '@/lib/schemas';

const REPLACEMENTS = {
  'Cala Canalicas': {
    Longitud: '37.4318528',
    Latitud: '-1.5091859',
  },
  'Playa de Gollerón (Cala del Turco)': {
    Longitud: '37.6545228',
    Latitud: '-0.734669',
    Mar: 'Mar Menor',
  },
  'Playa de La Gola': {
    Longitud: '37.6506976',
    Latitud: '-0.7249991',
  },
  'Playa del Saladar': {
    Mar: 'Mar Mediterráneo',
  },
  'Playa El Gachero': {
    Mar: 'Mar Mediterráneo',
  },
} as const;

export const injectFallbacks = (rawBeach: RawBeach): RawBeach =>
  pipe(
    rawBeach.Nombre,
    (name) => REPLACEMENTS[name as keyof typeof REPLACEMENTS],
    O.fromNullable,
    O.match(
      () => rawBeach,
      (replacement) => ({ ...rawBeach, ...replacement }),
    ),
  );
