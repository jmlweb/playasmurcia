import { writeFile } from '@/pods/fileSystem';

import { getBeachesFsPath } from '../config';

export const writeBeaches = writeFile(getBeachesFsPath());
