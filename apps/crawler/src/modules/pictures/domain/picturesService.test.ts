import * as TE from 'fp-ts/TaskEither';

import { PicturesService } from './picturesService';
import { PictureService } from './types';

const stringToHash = (source: string) => {
  let hash = 0;
  if (source.length == 0) return hash;
  for (let i = 0; i < source.length; i++) {
    let char = source.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
};

describe('PicturesService', () => {
  const fakePictureService: PictureService = {
    process: (source: string) => {
      const hash = stringToHash(source);
      return hash % 2 === 0
        ? TE.right(source)
        : TE.left(new Error('Invalid source'));
    },
    delete: (source: string) => {
      const hash = stringToHash(source);
      return hash % 2 === 0
        ? TE.right(undefined)
        : TE.left(new Error('Invalid source'));
    },
  };

  const picturesService = PicturesService(fakePictureService);

  it('should process a list of sources, resolving a record of valid/invalid pictures', async () => {
    const result = await picturesService.process([
      'foto1.jpg',
      'foto2.jpg',
      'foto3.jpg',
      'foto4.jpg',
      'foto5.jpg',
      'foto6.jpg',
      'foto7.jpg',
      'foto8.jpg',
      'foto9.jpg',
    ])();
    expect(result).toEqual({
      valid: ['foto1.jpg', 'foto3.jpg', 'foto5.jpg', 'foto7.jpg', 'foto9.jpg'],
      invalid: ['foto2.jpg', 'foto4.jpg', 'foto6.jpg', 'foto8.jpg'],
    });
  });

  it('should work in the same manner for delete', async () => {
    const result = await picturesService.delete([
      'foto1.jpg',
      'foto2.jpg',
      'foto3.jpg',
      'foto4.jpg',
      'foto5.jpg',
      'foto6.jpg',
      'foto7.jpg',
      'foto8.jpg',
      'foto9.jpg',
    ])();
    expect(result).toEqual({
      valid: ['foto1.jpg', 'foto3.jpg', 'foto5.jpg', 'foto7.jpg', 'foto9.jpg'],
      invalid: ['foto2.jpg', 'foto4.jpg', 'foto6.jpg', 'foto8.jpg'],
    });
  });
});
