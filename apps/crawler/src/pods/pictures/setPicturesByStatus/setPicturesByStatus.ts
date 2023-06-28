import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { getPicturesByStatusPath } from '@/config';
import { writeFile } from '@/pods/fileSystem';
import { stringify } from '@/pods/json';

import { PicturesByStatus } from '../schemas';

export const setPicturesByStatus = (newPicturesByStatus: PicturesByStatus) =>
  pipe(
    newPicturesByStatus,
    stringify,
    TE.fromEither,
    TE.bindTo('data'),
    TE.bindW('writeToPictures', () =>
      pipe(getPicturesByStatusPath, TE.fromIO, TE.map(writeFile)),
    ),
    TE.chain(({ data, writeToPictures }) => writeToPictures(data)),
  );
