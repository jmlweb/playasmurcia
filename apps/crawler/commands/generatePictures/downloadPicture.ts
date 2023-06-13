import * as E from 'fp-ts/Either';
import { constant, flow, LazyArg, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import download from 'image-downloader';

import { getPicturesPath, getPicturesURL } from '@/constants';
import { makeBindFn } from '@/lib';

const unsafeDownloadPicture = flow(
  TE.fromPredicate(S.isString, constant('not a string')),
  TE.bindTo('picture'),
  TE.bindW('picturesURL', makeBindFn(getPicturesURL)),
  TE.bindW('picturesPath', makeBindFn(getPicturesPath)),
  TE.flatMap(({ picture, picturesURL, picturesPath }) =>
    TE.tryCatch(
      () =>
        download
          .image({
            url: `${picturesURL}${picture}`,
            dest: picturesPath,
          })
          .then(constant(picture)),
      constant(picture),
    ),
  ),
);

const R = T.getRaceMonoid<E.Either<string, string>>();

export const downloadPicture = (picture: string) =>
  R.concat(
    unsafeDownloadPicture(picture),
    pipe(E.left(picture), T.of, T.delay(3000)),
  );
