import fs from 'node:fs/promises';
import path from 'node:path';
import { validateImageSize } from './validate-image-size';

const BATCH_SIZE = 4;
const BATCH_DELAY_MS = 1000;

export const PicturesExtractor = async () => {
  const resultsDir = path.join(process.cwd(), 'results/pictures');
  await fs.mkdir(resultsDir, { recursive: true });

  return async (beach: { pictures?: string[] }) => {
    if (!beach.pictures) {
      return beach;
    }

    const successfulPictures: string[] = [];
    const pictureNames = beach.pictures;

    await Promise.all(
      pictureNames.map(async (pictureName) => {
        const picturePath = path.join(resultsDir, pictureName);
        const pictureExists = await fs
          .access(picturePath)
          .then(() => true)
          .catch(() => false);

        if (pictureExists) {
          console.log(`Picture already exists: ${pictureName}`);
        } else {
          const pictureUrl = `http://www.murciaturistica.es/webs/murciaturistica/fotos/1/playas/${pictureName}`;
          await downloader.process(pictureUrl, picturePath);
        }

        const isValidSize = await validateImageSize(picturePath);
        if (isValidSize) {
          successfulPictures.push(pictureName);
        } else if (pictureExists) {
          await fs.unlink(picturePath);
        }
      }),
    );
  };
};
