import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
const tf = require('@tensorflow/tfjs-node');
const Upscaler = require('upscaler/node');
const x4 = require('@upscalerjs/esrgan-thick/4x');

const pFs = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
};

import { getPicturesPath } from '@/constants';

export const optimizePictures = async () => {
  const upscaler = new Upscaler({
    model: x4,
  });
  const tensor = await upscaler.upscale(
    path.join(getPicturesPath(), 'avellan2_g.jpg'),
  );
  const upscaledTensor = await tf.node.encodeJpeg(tensor);
  await pFs.writeFile(
    path.join(getPicturesPath(), 'upscaled', 'avellan2_g.jpg'),
    upscaledTensor,
  );
};
