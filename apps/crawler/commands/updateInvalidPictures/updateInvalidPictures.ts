import * as AP from 'fp-ts/Apply';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { constant, flow, identity, pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import fetch from 'node-fetch';

import { writeDataFile } from '@/lib';

import { getData } from '../getData';

const mergeFn = (a: T.Task<E.Either<string, null>[]>): T.Task<string[]> =>
  T.map((e: E.Either<string, null>[]) =>
    e.reduce((acc, cur) => {
      // our reducer is still pure, as we pass fresh object literal as initial value
      if (E.isLeft(cur)) acc.push(cur.left);
      return acc;
    }, [] as string[]),
  )(a);

const getFailedImage = (url: string) =>
  pipe(
    `http://www.murciaturistica.es/webs/murciaturistica/fotos/1/playas/${url}`,
    TE.tryCatchK(fetch, constant(url)),
    TE.filterOrElse(({ ok }) => ok, constant(url)),
    TE.map(() => null),
  );

export const updateInvalidPictures2 = pipe(
  getData,
  TE.map(
    flow(
      A.flatMap(({ pictures }) => pictures),
      (arr) => arr.slice(0, 200),
      A.map(getFailedImage),
      A.sequence(T.ApplicativePar),
      mergeFn,
    ),
  ),
  TE.flatMap(TE.fromTask),
  TE.flatMap(writeDataFile('invalidPictures.json')),
);
