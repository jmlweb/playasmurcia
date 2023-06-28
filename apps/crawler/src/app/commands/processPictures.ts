import * as A from 'fp-ts/Array';
import * as Console from 'fp-ts/Console';
import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';

import { stringify } from '@/pods/json';
import {
  downloadPicture,
  getPicturesByStatus,
  getPicturesToCheck,
  setPicturesByStatus,
  validatePictureDimensions,
} from '@/pods/pictures';
import { PicturesByStatus } from '@/pods/pictures/schemas';

import { Command } from './types';

const mergeFn = (a: T.Task<PicturesByStatus[]>): T.Task<PicturesByStatus> =>
  T.map((e: PicturesByStatus[]) =>
    e.reduce(
      (acc, cur) => {
        // our reducer is still pure, as we pass fresh object literal as initial value
        acc.valid.push(...cur.valid);
        acc.invalid.push(...cur.invalid);
        return acc;
      },
      {
        valid: [],
        invalid: [],
      } as PicturesByStatus,
    ),
  )(a);

const processPictureSafely = (picture: string) =>
  pipe(
    picture,
    downloadPicture,
    TE.chain(validatePictureDimensions),
    TE.match(
      () => E.left(picture),
      () => E.right(picture),
    ),
    T.tapIO(
      flow(
        E.match(
          (l) => `❌ ${l}`,
          (r) => `✅ ${r}`,
        ),
        Console.log,
      ),
    ),
  );

const processPicturesChunk = flow(
  A.map(processPictureSafely),
  A.sequence(T.ApplicativePar),
  T.map(
    A.reduce({ valid: [], invalid: [] } as PicturesByStatus, (acc, curr) => ({
      ...acc,
      ...pipe(
        curr,
        E.matchW(
          (l) => ({ invalid: A.append(l)(acc.invalid) }),
          (r) => ({ valid: A.append(r)(acc.valid) }),
        ),
      ),
    })),
  ),
  T.delay(200),
);

export const processPictures: Command = () =>
  pipe(
    getPicturesByStatus,
    TE.fromTask,
    TE.bindTo('picturesByStatus'),
    TE.bind('toCheck', ({ picturesByStatus }) =>
      pipe(
        picturesByStatus,
        getPicturesToCheck,
        TE.chain(
          TE.fromPredicate(
            (pictures) => pictures.length > 0,
            () => new Error('No pictures to check'),
          ),
        ),
      ),
    ),
    TE.chainW(({ picturesByStatus, toCheck }) =>
      pipe(
        toCheck,
        A.chunksOf(5),
        A.map(processPicturesChunk),
        A.sequence(T.ApplicativeSeq),
        mergeFn,
        TE.fromTask,
        TE.map((result) => ({
          valid: [...picturesByStatus.valid, ...result.valid],
          invalid: result.invalid,
        })),
        TE.bindTo('result'),
        TE.bind('writeResult', ({ result }) => setPicturesByStatus(result)),
        TE.chain(({ result }) =>
          TE.fromEither(
            stringify({
              valid: result.valid.length,
              invalid: result.invalid.length,
              total: result.valid.length + result.invalid.length,
            }),
          ),
        ),
      ),
    ),
  );
