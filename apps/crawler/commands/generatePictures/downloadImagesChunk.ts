import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';

import { downloadPicture } from './downloadPicture';
import { Result } from './types';

export const downloadImagesChunk = flow(
  A.map(downloadPicture),
  A.sequence(T.ApplicativePar),
  T.map(
    A.reduce({ valid: [], invalid: [] } as Result, (acc, curr) => ({
      ...acc,
      ...pipe(
        curr,
        E.foldW(
          (l) => ({ invalid: A.append(l)(acc.invalid) }),
          (r) => ({ valid: A.append(r)(acc.valid) }),
        ),
      ),
    })),
  ),
  T.delay(1000),
);
