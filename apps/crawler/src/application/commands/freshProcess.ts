import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import {
  LocalBeachesRepository,
  RemoteBeachesRepository,
} from '@/modules/beaches';
import {
  LocalPictureService,
  LocalPicturesResultsRepository,
  PicturesService,
} from '@/modules/pictures';

import { config } from '../config';
import { Command } from '../types';

export const freshProcess: Command = () => {
  const localBeachesRepository = LocalBeachesRepository(config.dataPath());
  const remoteBeachesRepository = RemoteBeachesRepository(
    localBeachesRepository.set,
  );
  const pictureService = LocalPictureService({
    picturesURL: config.picturesURL(),
    picturesPath: config.picturesPath(),
  });

  const picturesService = PicturesService(pictureService);

  const picturesResultsRepository = LocalPicturesResultsRepository(
    config.dataPath(),
  );

  return pipe(
    remoteBeachesRepository.get,
    TE.bindTo('beaches'),
    TE.bind('storeBeaches', ({ beaches }) =>
      localBeachesRepository.set(beaches),
    ),
    TE.bind('pictures', () => localBeachesRepository.pictures),
    TE.bind('cleanPictures', ({ pictures }) =>
      TE.fromTask(picturesService.delete(pictures)),
    ),
    TE.bind('picturesResults', ({ pictures }) =>
      TE.fromTask(picturesService.process(pictures)),
    ),
    TE.bind('storePicturesResults', ({ picturesResults }) =>
      picturesResultsRepository.set(picturesResults),
    ),
    TE.bind('deleteInvalidPictures', ({ picturesResults }) =>
      TE.fromTask(picturesService.delete(picturesResults.invalid)),
    ),
    TE.bindW('updateBeachesPictures', ({ picturesResults }) =>
      localBeachesRepository.removePicturesFromBeaches(picturesResults.invalid),
    ),
    TE.map(
      ({ beaches, picturesResults }) =>
        `${beaches.length} beaches\n${picturesResults.valid.length} pictures valid\n${picturesResults.invalid.length} pictures invalid`,
    ),
  );
};
