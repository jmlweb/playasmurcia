import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';

import { getPicturesFile } from '@/constants';
import { writeDataFile } from '@/lib';

import { downloadImagesChunk } from './downloadImagesChunk';
import { getInitialPictures } from './getInitialPictures';
import { Result, Results } from './types';

const mergeFn = (a: T.Task<Results>): T.Task<Result> =>
  T.map((e: Results) =>
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
      } as Result,
    ),
  )(a);

const writeToPicturesFile = pipe(getPicturesFile, IO.map(writeDataFile));

export const generatePictures = pipe(
  getInitialPictures,
  TE.filterOrElse(
    ({ toCheck }) => toCheck.length > 0,
    () => 'No pictures to download',
  ),
  TE.flatMap(({ valid, invalid, toCheck }) =>
    pipe(
      toCheck,
      A.chunksOf(5),
      A.map(downloadImagesChunk),
      A.sequence(T.ApplicativeSeq),
      mergeFn,
      TE.fromTask,
      TE.map((result) => ({
        valid: [...valid, ...result.valid],
        invalid: [...invalid, ...result.invalid],
      })),
    ),
  ),
  TE.flatMap(writeToPicturesFile()),
  TE.getOrElse((x) => {
    throw new Error(x);
  }),
);
