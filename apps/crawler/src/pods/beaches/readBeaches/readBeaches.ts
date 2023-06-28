import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { readFile } from '@/pods/fileSystem';
import { parse } from '@/pods/json';

import { getBeachesFsPath } from '../config';
import { arrayOfBeachesSchema } from '../schemas';

export const readBeaches = pipe(
  getBeachesFsPath,
  TE.fromIO,
  TE.chain(readFile),
  TE.chainEitherK(parse),
  TE.chainEitherK(E.tryCatchK(arrayOfBeachesSchema.parse, E.toError)),
);
