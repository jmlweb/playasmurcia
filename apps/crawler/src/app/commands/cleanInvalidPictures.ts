import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';

import { getPicturesPath } from '@/config';
import { readBeaches, writeBeaches } from '@/pods/beaches';
import { Beach } from '@/pods/beaches/schemas';
import { deleteFile } from '@/pods/fileSystem';
import { stringify } from '@/pods/json';
import { getPicturesByStatus } from '@/pods/pictures';

import { Command } from './types';

const deletePictureTask = (picture: string) =>
  pipe(
    getPicturesPath,
    TE.fromIO,
    TE.map((path) => `${path}/${picture}`),
    TE.chain(deleteFile),
    TE.match(
      () => E.left(picture),
      () => E.right(picture),
    ),
  );

export const cleanInvalidPictures: Command = () =>
  pipe(
    getPicturesByStatus,
    T.map(({ invalid }) => invalid),
    TE.fromTask,
    TE.bindTo('invalidPictures'),
    TE.bind('deleteFilesResult', ({ invalidPictures }) =>
      pipe(
        invalidPictures,
        A.map(deletePictureTask),
        A.sequence(T.ApplicativePar),
        T.map(A.reduce(0, (acc, curr) => (E.isRight(curr) ? acc + 1 : acc))),
        TE.fromTask,
      ),
    ),
    TE.bind('deleteFromDataResult', ({ invalidPictures }) =>
      pipe(
        readBeaches,
        TE.map(
          A.reduce({ invalidPictures, beaches: [] as Beach[] }, (acc, curr) => {
            const invalidPicturesFromCurr = curr.pictures.filter((picture) =>
              invalidPictures.includes(picture),
            );
            acc.beaches.push({
              ...curr,
              pictures: curr.pictures.filter(
                (picture) => !invalidPicturesFromCurr.includes(picture),
              ),
            });
            acc.invalidPictures = acc.invalidPictures.filter(
              (picture) => !invalidPicturesFromCurr.includes(picture),
            );
            return acc;
          }),
        ),
        TE.map(({ beaches }) => beaches),
        TE.chainEitherK(stringify),
        TE.chain(writeBeaches),
      ),
    ),
    TE.map(({ deleteFilesResult }) => `${deleteFilesResult} files deleted`),
  );
