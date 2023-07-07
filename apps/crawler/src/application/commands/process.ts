import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as TE from 'fp-ts/TaskEither';

import { HybridBeachesRepository } from '@/modules/beaches';
import {
  LocalPictureService,
  LocalPicturesResultsRepository,
  PicturesService,
} from '@/modules/pictures';

import { config } from '../config';
import { Command } from '../types';

export const process: Command = () => {
  const beachesRepository = HybridBeachesRepository(config.dataPath());

  const pictureService = LocalPictureService({
    picturesURL: config.picturesURL(),
    picturesPath: config.picturesPath(),
  });

  const picturesService = PicturesService(pictureService);

  const picturesResultsRepository = LocalPicturesResultsRepository(
    config.dataPath(),
  );

  return pipe(
    beachesRepository.get,
    TE.bindTo('beaches'),
    TE.bind('pictures', () => beachesRepository.pictures),
    TE.bindW('currentPicturesResults', () => picturesResultsRepository.safeGet),
    TE.bind('cleanPictures', ({ currentPicturesResults }) =>
      TE.fromTask(picturesService.delete(currentPicturesResults.invalid)),
    ),
    TE.bind('newPicturesResults', ({ pictures, currentPicturesResults }) =>
      TE.fromTask(
        picturesService.process(
          A.difference(S.Eq)(pictures, currentPicturesResults.valid),
        ),
      ),
    ),
    TE.bind('updatePicturesResults', ({ newPicturesResults }) =>
      picturesResultsRepository.update(newPicturesResults),
    ),
    TE.bind('deleteInvalidPictures', ({ newPicturesResults }) =>
      TE.fromTask(picturesService.delete(newPicturesResults.invalid)),
    ),
    TE.bindW('updateBeachesPictures', ({ newPicturesResults }) =>
      beachesRepository.removePicturesFromBeaches(newPicturesResults.invalid),
    ),
    TE.map(
      ({ beaches, newPicturesResults }) =>
        `${beaches.length} beaches\n${newPicturesResults.valid.length} pictures valid\n${newPicturesResults.invalid.length} pictures invalid`,
    ),
  );
};
