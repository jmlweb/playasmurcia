import fs from 'node:fs/promises';
import path from 'node:path';

import download from 'image-downloader';

import { validateImageSize } from './pictures-extractor/validate-image-size';

const BATCH_SIZE = 4;
const BATCH_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const PicturesExtractor = async () => {
  const resultsDir = path.join(process.cwd(), 'results/pictures');
  await fs.mkdir(resultsDir, { recursive: true });

  return async (beach: { pictures?: string[] }) => {
    if (!beach.pictures) {
      return beach;
    }

    const successfulPictures: string[] = [];
    const pictureNames = beach.pictures;

    for (let i = 0; i < pictureNames.length; i += BATCH_SIZE) {
      const batch = pictureNames.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (pictureName) => {
          const picturePath = path.join(resultsDir, pictureName);
          const pictureExists = await fs
            .access(picturePath)
            .then(() => true)
            .catch(() => false);

          if (pictureExists) {
            console.log(`Picture already exists: ${pictureName}`);
            const isValidSize = await validateImageSize(picturePath);
            if (isValidSize) {
              successfulPictures.push(pictureName);
            } else {
              await fs.unlink(picturePath);
            }
          } else {
            const pictureUrl = `http://www.murciaturistica.es/webs/murciaturistica/fotos/1/playas/${pictureName}`;

            try {
              await download.image({
                url: pictureUrl,
                dest: picturePath,
                timeout: 4000,
              });

              const isValidSize = await validateImageSize(picturePath);
              if (isValidSize) {
                successfulPictures.push(pictureName);
              }
            } catch (error) {
              console.error(
                `There was an error downloading the picture: ${pictureName}: ${error instanceof Error ? error.message : error}`,
              );
            }
          }
        }),
      );
      if (i + BATCH_SIZE < pictureNames.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    return {
      ...beach,
      pictures: successfulPictures.length > 0 ? successfulPictures : undefined,
    };
  };
};
