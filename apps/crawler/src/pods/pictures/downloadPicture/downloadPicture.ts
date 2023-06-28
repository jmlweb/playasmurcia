import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import * as P from 'fp-ts/Predicate';
import * as S from 'fp-ts/string';
import * as TE from 'fp-ts/TaskEither';
import download from 'image-downloader';

import { getPicturesPath, getPicturesURL } from '@/config';
import { createNeededDirsForPath } from '@/pods/fileSystem';

const makePropGetter =
  (fn: IO.IO<string>) =>
  <N extends string>({ name }: { name: N }) =>
    pipe(
      TE.fromIO(fn),
      TE.map((value) => `${value}/${name}`),
    );

export const downloadPicture = flow(
  TE.fromPredicate(
    P.not(S.isEmpty),
    () => new Error('argument cannot be empty'),
  ),
  TE.bindTo('name'),
  TE.bindW('url', makePropGetter(getPicturesURL)),
  TE.bindW('path', makePropGetter(getPicturesPath)),
  TE.bindW('securePath', ({ path }) => createNeededDirsForPath(path)),
  TE.chain(
    TE.tryCatchK(
      ({ url, path }) => download.image({ url, dest: path, timeout: 4000 }),
      E.toError,
    ),
  ),
  TE.map(({ filename }) => filename),
);
