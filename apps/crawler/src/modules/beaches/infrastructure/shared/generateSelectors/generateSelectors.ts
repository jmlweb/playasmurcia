import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { BeachesRepository } from '@/modules/beaches/domain';

import { removePicturesFromBeaches } from '../removePicturesFromBeaches';
import { extractMunicipalities } from './extractMunicipalities';
import { extractPictures } from './extractPictures';

export const generateSelectors = <
  T extends Pick<BeachesRepository, 'get' | 'set'>,
>(
  repository: T,
): BeachesRepository => ({
  ...repository,
  municipalities: pipe(repository.get, TE.map(extractMunicipalities)),
  pictures: pipe(repository.get, TE.map(extractPictures)),
  removePicturesFromBeaches: (pictures) =>
    pipe(
      repository.get,
      TE.map(removePicturesFromBeaches(pictures)),
      TE.chain(repository.set),
    ),
});
