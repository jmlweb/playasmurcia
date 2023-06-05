import * as A from 'fp-ts/Array';
import { constant, pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import fetch from 'node-fetch';

import { writeDataFile } from '@/lib';

import { getData } from '../getData';

const getFailedImage = (url: string) =>
  pipe(
    `http://www.murciaturistica.es/webs/murciaturistica/fotos/1/playas/${url}`,
    TE.tryCatchK(fetch, constant(url)),
    TE.filterOrElse(({ ok }) => ok, constant(url)),
    TE.map(constant(null)),
    TE.swap,
    TE.getOrElseW(() => T.of(null)),
  );

export const updateInvalidPictures = pipe(
  getData,
  TE.map(A.flatMap(({ pictures }) => pictures)),
  TE.map(A.takeLeft(50)),
);
