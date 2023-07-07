import * as TE from 'fp-ts/TaskEither';
import { z } from 'zod';

import { beachesSchema, beachSchema } from './schemas';

export type Beach = z.infer<typeof beachSchema>;
export type Beaches = z.infer<typeof beachesSchema>;

export type BeachesRepository = {
  get: TE.TaskEither<Error, Beaches>;
  set: (data: Beaches) => TE.TaskEither<Error, void>;
  pictures: TE.TaskEither<Error, string[]>;
  municipalities: TE.TaskEither<Error, string[]>;
  removePicturesFromBeaches: (pictures: string[]) => TE.TaskEither<Error, void>;
};
