import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

import { RawBeach } from '../schemas';

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

const isReplacement = (name: string): name is keyof typeof REPLACEMENTS =>
  name in REPLACEMENTS;

export const injectFallbacks = (rawBeach: RawBeach): RawBeach =>
  pipe(
    rawBeach.Nombre,
    O.fromPredicate(isReplacement),
    O.match(
      () => rawBeach,
      (name) => ({ ...rawBeach, ...REPLACEMENTS[name] }),
    ),
  );
