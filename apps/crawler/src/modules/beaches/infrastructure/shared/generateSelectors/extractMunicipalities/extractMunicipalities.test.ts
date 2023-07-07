import { Beaches } from '../../../domain';
import { extractMunicipalities } from './extractMunicipalities';

describe('extractMunicipalities', () => {
  const fakeBeaches = [
    {
      municipality: 'Mazarrón',
    },
    {
      municipality: 'Cartagena',
    },
    {
      municipality: 'Mazarrón',
    },
    {
      municipality: 'Los Alcázares',
    },
    {
      municipality: 'Cartagena',
    },
    {
      municipality: 'Águilas',
    },
  ];

  it('should return an array of unique municipalities', () => {
    expect(extractMunicipalities(fakeBeaches as Beaches)).toEqual([
      'Águilas',
      'Cartagena',
      'Los Alcázares',
      'Mazarrón',
    ]);
  });
});
