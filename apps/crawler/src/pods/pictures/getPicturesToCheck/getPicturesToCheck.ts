import * as A from 'fp-ts/Array';
import { flow } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as TE from 'fp-ts/TaskEither';

import { getBeachesPictures } from '../../beaches';
import { PicturesByStatus } from '../schemas';

const makeCheckedPictures = ({ valid }: PicturesByStatus) => valid;
const unique = A.difference(S.Eq);

export const getPicturesToCheck = flow(
  makeCheckedPictures,
  TE.of,
  TE.bindTo('checkedPictures'),
  TE.bind('picturesList', () => getBeachesPictures),
  TE.map(({ checkedPictures, picturesList }) =>
    unique(picturesList, checkedPictures),
  ),
);
