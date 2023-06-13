import { constant } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import path from 'path';

export const getPicturesPath: IO.IO<string> = () =>
  path.join(__dirname, './pictures');

export const getPicturesURL = constant(
  'http://www.murciaturistica.es/webs/murciaturistica/fotos/1/playas/',
);

export const getPicturesFile = constant('pictures.json');

export const optimizedPicturesPath: IO.IO<string> = () =>
  path.join(__dirname, './optimizedPictures');
