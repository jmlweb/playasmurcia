import { constVoid, pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { HybridBeachesRepository } from '@/modules/beaches';
import {
  LocalPictureService,
  LocalPicturesResultsRepository,
} from '@/modules/pictures';

import { config } from '../config';
import { Command } from '../types';

export const processPicture: Command = (source: string) => {
  const beachesRepository = HybridBeachesRepository(config.dataPath());

  const pictureService = LocalPictureService({
    picturesURL: config.picturesURL(),
    picturesPath: config.picturesPath(),
  });

  const picturesResultsRepository = LocalPicturesResultsRepository(
    config.dataPath(),
  );

  const deleteImage = () =>
    pipe(
      source,
      pictureService.delete,
      TE.orElse(() => TE.of(constVoid())),
    );

  return pipe(
    TE.Do,
    TE.bind('deletePreviousImage', deleteImage),
    TE.bind('results', () =>
      pipe(
        pictureService.process(source),
        TE.match(
          () => ({
            invalid: [source],
            valid: [] as string[],
          }),
          () => ({
            invalid: [],
            valid: [source],
          }),
        ),
        TE.fromTask,
      ),
    ),
    TE.bind('updatePictures', ({ results }) =>
      picturesResultsRepository.update(results),
    ),
    TE.bind('updateBeaches', ({ results }) =>
      beachesRepository.removePicturesFromBeaches(results.invalid),
    ),
    TE.bindW('deleteCurrentImage', deleteImage),
    TE.map(
      ({ results }) =>
        `${source}: ${results.valid.length > 0 ? 'valid' : 'invalid'}`,
    ),
  );
};
