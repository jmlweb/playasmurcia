import * as E from 'fp-ts/Either';
import { constant, pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { readDataFile } from '@/lib';
import { arrayOfBeachesSchema } from '@/lib/schemas';

export const getRawDataFromFile = pipe(
  readDataFile('raw.json'),
  TE.flatMapEither(
    E.tryCatchK(
      (json) => arrayOfBeachesSchema.parse(json),
      constant('Failed to validate data as array of raw beaches'),
    ),
  ),
);
