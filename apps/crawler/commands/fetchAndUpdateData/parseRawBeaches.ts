import * as A from 'fp-ts/Array';
import { flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

import { rawBeachSchema } from '@/lib/schemas';

import { injectFallbacks } from './injectFallbacks';
import { parseRawBeach } from './parseRawBeach';

export const parseRawBeaches = flow(
  A.map(
    flow(
      injectFallbacks,
      O.tryCatchK(rawBeachSchema.parse),
      O.map(parseRawBeach),
    ),
  ),
  A.compact,
);
