import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as P from 'fp-ts/Predicate';
import * as S from 'fp-ts/string';
import * as TE from 'fp-ts/TaskEither';
import fetch from 'node-fetch';

import { parse } from '@/pods/json';

import { arrayOfThingsSchema, rawBeachSchema } from '../schemas';
import { injectFallbacks } from './injectFallbacks';
import { parseRawBeach } from './parseRawBeach';

const parseArrayOfThings = flow(
  parse,
  E.chain(E.tryCatchK(arrayOfThingsSchema.parse, E.toError)),
);

const extractBeaches = flow(
  A.map(
    flow(
      injectFallbacks,
      O.tryCatchK(rawBeachSchema.parse),
      O.map(parseRawBeach),
    ),
  ),
  A.compact,
);

export const fetchBeaches = pipe(
  'http://nexo.carm.es/nexo/archivos/recursos/opendata/json/Playas.json',
  TE.tryCatchK(fetch, E.toError),
  TE.filterOrElse(
    ({ ok }) => ok,
    ({ status }) => new Error(`Response failed with status code: ${status}`),
  ),
  TE.chain(TE.tryCatchK((res) => res.text(), E.toError)),
  TE.map(S.replace(/[\ufeff|\t|\n]/g, '')),
  TE.flatMapEither(parseArrayOfThings),
  TE.map(extractBeaches),
  TE.chain(
    TE.fromPredicate(P.not(A.isEmpty), () => new Error('Empty beaches')),
  ),
);
