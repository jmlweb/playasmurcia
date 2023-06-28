import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as TE from 'fp-ts/TaskEither';

import {
  downloadPicture,
  getPicturesByStatus,
  setPicturesByStatus,
  validatePictureDimensions,
} from '@/pods/pictures';
import { PicturesByStatus } from '@/pods/pictures/schemas';

import { Command } from './types';

const addToPicturesByStatus =
  (picture: string, status: 'valid' | 'invalid') =>
  (picturesByStatus: PicturesByStatus): PicturesByStatus =>
    pipe(
      picturesByStatus,
      ({ valid, invalid }) => ({
        valid: valid.filter((p) => p !== picture),
        invalid: invalid.filter((p) => p !== picture),
      }),
      (filteredPicturesByStatus) => ({
        ...filteredPicturesByStatus,
        [status]: [...filteredPicturesByStatus[status], picture],
      }),
    );

export const processPicture: Command = flow(
  TE.fromPredicate(S.isString, () => new Error('No picture provided')),
  TE.bindTo('picture'),
  TE.bindW('status', ({ picture }) =>
    pipe(
      picture,
      downloadPicture,
      TE.chain(validatePictureDimensions),
      TE.match(
        () => 'invalid' as const,
        () => 'valid' as const,
      ),
      TE.fromTask,
    ),
  ),
  TE.chainW(({ picture, status }) =>
    pipe(
      getPicturesByStatus,
      TE.fromTask,
      TE.map(addToPicturesByStatus(picture, status)),
      TE.chain(setPicturesByStatus),
      TE.as(`${picture}: ${status}`),
      TE.tap(TE.of),
    ),
  ),
);
