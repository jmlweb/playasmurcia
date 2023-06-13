import * as A from 'fp-ts/Array';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as TE from 'fp-ts/TaskEither';

import { getData } from '../getData';
import { getPicturesFromFile } from './getPicturesFromFile';

export const getUniquePictures = pipe(
  getPicturesFromFile,
  TE.fromTask,
  TE.bindTo('initial'),
  TE.bind('serverData', () =>
    pipe(getData, TE.map(flow(A.flatMap(({ pictures }) => pictures)))),
  ),
  TE.map(({ initial, serverData }) =>
    A.difference(S.Eq)(
      serverData,
      A.union(S.Eq)(initial.valid, initial.invalid),
    ),
  ),
);

const stringArrDifference = A.difference(S.Eq);

export const getInitialPictures = pipe(
  getPicturesFromFile,
  TE.fromTask,
  TE.bindTo('fromFile'),
  TE.bind('serverData', () =>
    pipe(getData, TE.map(flow(A.flatMap(({ pictures }) => pictures)))),
  ),
  TE.map(({ fromFile, serverData }) => ({
    valid: fromFile.valid,
    invalid: fromFile.invalid,
    toCheck: pipe(
      serverData,
      stringArrDifference(fromFile.valid),
      stringArrDifference(fromFile.invalid),
    ),
  })),
);
