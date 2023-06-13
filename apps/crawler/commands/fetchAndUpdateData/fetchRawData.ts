import * as E from 'fp-ts/Either';
import { constant, flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as TE from 'fp-ts/TaskEither';
import fetch from 'node-fetch';

import { parse } from '@/lib';
import { arrayOfThingsSchema } from '@/lib/schemas';

const getURL = TE.of(
  'http://nexo.carm.es/nexo/archivos/recursos/opendata/json/Playas.json',
);

export const fetchRawData = pipe(
  getURL,
  TE.flatMap(
    TE.tryCatchK(fetch, constant('Error fetching beaches from remote server')),
  ),
  TE.filterOrElse(
    ({ ok }) => ok,
    ({ status }) => `Response failed with status code: ${status}`,
  ),
  TE.flatMap(
    TE.tryCatchK(
      (res) => res.text(),
      constant('Failed to read text from response'),
    ),
  ),
  TE.flatMapEither(
    E.fromPredicate(S.isString, constant('Response is not a string')),
  ),
  TE.flatMapEither(
    flow(
      S.replace(/[\ufeff|\t|\n]/g, ''),
      parse,
      E.flatMap(
        E.tryCatchK(
          arrayOfThingsSchema.parse,
          constant('Failed to validate data as array of things'),
        ),
      ),
    ),
  ),
);
