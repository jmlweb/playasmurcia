import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { fetchBeachesWithPersistence } from '@/pods/beaches';
import { stringify } from '@/pods/json';

import { Command } from './types';

export const fetchBeachesData: Command = () =>
  pipe(fetchBeachesWithPersistence, TE.chainEitherK(stringify));
