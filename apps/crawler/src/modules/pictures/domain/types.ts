import * as TE from 'fp-ts/TaskEither';
import { z } from 'zod';

import { picturesResultsSchema } from './schemas';

export type PicturesResults = z.infer<typeof picturesResultsSchema>;

export type PictureService = {
  process: (source: string) => TE.TaskEither<Error, string>;
  delete: (source: string) => TE.TaskEither<Error, void>;
};

export type PicturesResultsRepository = {
  get: TE.TaskEither<Error, PicturesResults>;
  safeGet: TE.TaskEither<Error, PicturesResults>;
  pictures: TE.TaskEither<Error, string[]>;
  set: (results: PicturesResults) => TE.TaskEither<Error, void>;
  update: (results: Partial<PicturesResults>) => TE.TaskEither<Error, void>;
};
