import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { constant, flow, pipe } from 'fp-ts/function';
import * as J from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { arrayOfThingsSchema, rawBeachSchema } from './schemas';

const readFile = promisify(fs.readFile);

export const getRawDataFromFile = pipe(
  TE.tryCatch(
    () => readFile(path.resolve(__dirname, '../../data/raw.json'), 'utf-8'),
    constant('Failed to read data from file'),
  ),
  TE.flatMapEither(
    flow(
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
