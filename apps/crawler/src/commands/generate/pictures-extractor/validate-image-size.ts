import path from 'node:path';

import { imageSizeFromFile } from 'image-size/fromFile';

const MIN_WIDTH = 600;
const MIN_HEIGHT = 400;

export const validateImageSize = async (imagePath: string): Promise<boolean> => {
  try {
    const imageSize = await imageSizeFromFile(imagePath);
    const isValid =  imageSize.width >= MIN_WIDTH && imageSize.height >= MIN_HEIGHT;

    if (!isValid) {
      console.log(
        `Picture too small (${imageSize.width}x${imageSize.height}): ${path.basename(imagePath)}`,
      );
    }

    return isValid;
  } catch (error) {
    console.error(
      `Error validating image size for ${path.basename(imagePath)}: ${error instanceof Error ? error.message : error}`,
    );
    return false;
  }
};
