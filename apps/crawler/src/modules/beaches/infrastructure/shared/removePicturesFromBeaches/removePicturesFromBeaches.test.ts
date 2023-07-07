import { removePicturesFromBeaches } from './removePicturesFromBeaches';

describe('removePicturesFromBeaches', () => {
  it('should remove the pictures from the different beaches', () => {
    const results = removePicturesFromBeaches(['fake1.jpg', 'fake3.jpg'])([
      {
        name: 'Cala Arturo',
        slug: 'cala-arturo',
        municipality: 'Cartagena',
        position: [37.60183606268255, -0.7254260679392321],
        blueFlag: false,
        features: [],
        pictures: ['fake1.jpg', 'fake2.jpg'],
        sea: 0,
      },
      {
        name: 'Cala Avellán',
        slug: 'cala-avellan',
        municipality: 'Cartagena',
        position: [37.62993739960048, -0.7018737927370684],
        blueFlag: false,
        features: [],
        pictures: ['fake3.jpg'],
        sea: 0,
      },
      {
        name: 'Cala Blanca',
        slug: 'cala-blanca',
        address: '(GARROBILLO)',
        municipality: 'Lorca',
        district: 'GARROBILLO',
        phone: '968 47 37 07 /112',
        email: '112lorca@lorca.es',
        url: 'http://www.emergencias.lorca.es/playas-de-lorca.asp',
        position: [37.483338, -1.462284],
        blueFlag: false,
        features: [],
        pictures: ['recurso-1-628-2_g.jpg'],
        sea: 0,
      },
    ]);

    expect(results).toEqual([
      {
        name: 'Cala Arturo',
        slug: 'cala-arturo',
        municipality: 'Cartagena',
        position: [37.60183606268255, -0.7254260679392321],
        blueFlag: false,
        features: [],
        pictures: ['fake2.jpg'],
        sea: 0,
      },
      {
        name: 'Cala Avellán',
        slug: 'cala-avellan',
        municipality: 'Cartagena',
        position: [37.62993739960048, -0.7018737927370684],
        blueFlag: false,
        features: [],
        pictures: [],
        sea: 0,
      },
      {
        name: 'Cala Blanca',
        slug: 'cala-blanca',
        address: '(GARROBILLO)',
        municipality: 'Lorca',
        district: 'GARROBILLO',
        phone: '968 47 37 07 /112',
        email: '112lorca@lorca.es',
        url: 'http://www.emergencias.lorca.es/playas-de-lorca.asp',
        position: [37.483338, -1.462284],
        blueFlag: false,
        features: [],
        pictures: ['recurso-1-628-2_g.jpg'],
        sea: 0,
      },
    ]);
  });
});
