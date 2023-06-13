import * as E from 'fp-ts/Either';
import { constant, pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { z } from 'zod';

import { getPicturesFile } from '@/constants';
import { readDataFile } from '@/lib';
import { arrayOfStrings } from '@/lib/schemas';

const picturesSchema = z.object({
  valid: arrayOfStrings.optional().default([]),
  invalid: arrayOfStrings.optional().default([]),
});

type Pictures = z.infer<typeof picturesSchema>;

export const getPicturesFromFile = pipe(
  getPicturesFile,
  TE.fromIO,
  TE.flatMap(readDataFile),
  TE.flatMapEither(
    E.tryCatchK(picturesSchema.parse, constant('could not parse data')),
  ),
  TE.getOrElseW(() => T.of({ valid: [], invalid: [] } as Pictures)),
);
