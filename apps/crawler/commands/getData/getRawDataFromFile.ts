import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { constant, flow, pipe } from 'fp-ts/function';
import * as J from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

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
