import * as TE from 'fp-ts/TaskEither';

import { BeachesRepository } from '../../domain';
import { generateSelectors } from '../shared';
import { fetchBeaches } from './fetchBeaches';

const notImplemented = () => TE.left(new Error('Not implemented'));

export const RemoteBeachesRepository = (
  setter: BeachesRepository['set'] = notImplemented,
): BeachesRepository =>
  generateSelectors({
    get: fetchBeaches,
    set: setter,
  });
