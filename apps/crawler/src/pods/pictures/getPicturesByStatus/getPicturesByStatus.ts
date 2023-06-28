import * as E from 'fp-ts/Either';
import { constant, pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { getPicturesByStatusPath } from '@/config';

import { readFile } from '../../fileSystem';
import { parse } from '../../json';
import { PicturesByStatus, picturesByStatusSchema } from '../schemas';

const initialPicturesByStatus: PicturesByStatus = {
  valid: [],
  invalid: [],
};

export const getPicturesByStatus = pipe(
  getPicturesByStatusPath,
  TE.fromIO,
  TE.chain(readFile),
  TE.chainEitherK(parse),
  TE.chainEitherK(E.tryCatchK(picturesByStatusSchema.parse, E.toError)),
  TE.mapLeft(constant(initialPicturesByStatus)),
  TE.toUnion,
);
