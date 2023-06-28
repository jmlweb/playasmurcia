import * as IO from 'fp-ts/IO';
import path from 'path';

export const getAppPath: IO.IO<string> = () =>
  path.resolve(__dirname, '../../');
