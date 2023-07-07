import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Ord';
import * as S from 'fp-ts/string';

import { string } from '@/modules/string';

import { Beaches } from '../../../../domain';

export const extractMunicipalities = (beaches: Beaches) =>
  pipe(
    beaches,
    A.map(({ municipality }) => municipality),
    A.uniq(S.Eq),
    A.sort(O.contramap(string.slugify)(S.Ord)),
  );
