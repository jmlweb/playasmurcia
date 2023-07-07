import { pipe } from 'fp-ts/function';
import * as IO from 'fp-ts/IO';
import path from 'path';

const rootPath: IO.IO<string> = () => path.resolve(__dirname, '../..');

const dataPath = pipe(
  rootPath,
  IO.map((rootPath) => path.join(rootPath, './data')),
);

const picturesPath = pipe(
  rootPath,
  IO.map((rootPath) => path.join(rootPath, './pictures/source')),
);

const picturesURL = () =>
  'http://www.murciaturistica.es/webs/murciaturistica/fotos/1/playas/';

export const config = {
  rootPath,
  dataPath,
  picturesPath,
  picturesURL,
};
