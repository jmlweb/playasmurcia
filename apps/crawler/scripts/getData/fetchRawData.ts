import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { constant, flow, pipe } from 'fp-ts/function';
import * as J from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';
import * as TE from 'fp-ts/TaskEither';
import fetch from 'node-fetch';

import { arrayOfThingsSchema, rawBeachSchema } from './schemas';

const URL =
  'http://nexo.carm.es/nexo/archivos/recursos/opendata/json/Playas.json';

export const fetchRawData = pipe(
  TE.tryCatch(
    () => fetch(URL),
    constant('Error fetching beaches from remote server'),
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
      J.parse,
      E.mapLeft(constant('Failed to parse JSON')),
      E.chain(
        E.tryCatchK(
          (json) => arrayOfThingsSchema.parse(json),
          constant('Failed to validate data as array of things'),
        ),
      ),
    ),
  ),
  TE.map(flow(A.map(O.tryCatchK(rawBeachSchema.parse)), A.compact)),
);
