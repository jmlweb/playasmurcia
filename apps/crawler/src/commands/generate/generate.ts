import sourceData from '../../../source-data/beaches.json' assert { type: 'json' };
import { normalize } from './normalize/normalize';
import { PicturesExtractor } from './pictures-extractor';

export const generate = async () => {
  const extractPictures = await PicturesExtractor();
  const beaches = await Promise.all(
    sourceData.map(async (sourceItem) => {
      const normalizedItem = normalize(sourceItem);
      return extractPictures(normalizedItem);
    }),
  );
  console.log(beaches);
};
