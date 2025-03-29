import { normalize } from './normalize';

describe('normalize', () => {
  it('should translate the properties to english', () => {
    const beach = {
      Código: '551',
      Nombre: 'Cala de La Gruta',
      Municipio: 'Lorca',
      Latitud: '37.490493',
      Longitud: '-1.454182',
    };

    const normalized = normalize(beach);

    expect(normalized).toHaveProperty('code');
    expect(normalized).toHaveProperty('name');
    expect(normalized).toHaveProperty('municipality');
    // coordinates is built from the latitude and longitude
    expect(normalized).toHaveProperty('coordinates');
  });

  it('should convert multiple properties starting with "Foto" to an only property in a form of a array of strings named pictures', () => {
    const beach = {
      Código: '551',
      Nombre: 'Cala de La Gruta',
      Municipio: 'Lorca',
      Latitud: '37.490493',
      Longitud: '-1.454182',
      'Foto 1': 'https://example.com/foto1.jpg',
      'Foto 2': 'https://example.com/foto2.jpg',
      'Foto 3': 'https://example.com/foto3.jpg',
      'Foto 4': 'https://example.com/foto4.jpg',
      'Foto 5': 'https://example.com/foto5.jpg',
      'Foto 6': 'https://example.com/foto6.jpg',
    };

    const normalized = normalize(beach);

    expect(normalized).toEqual({
      code: '551',
      name: 'Cala de La Gruta',
      municipality: 'Lorca',
      coordinates: [37.490493, -1.454182],
      pictures: [
        'https://example.com/foto1.jpg',
        'https://example.com/foto2.jpg',
        'https://example.com/foto3.jpg',
        'https://example.com/foto4.jpg',
        'https://example.com/foto5.jpg',
        'https://example.com/foto6.jpg',
      ],
    });
  });

  it('should remove properties that are empty strings', () => {
    const beach = {
      Código: '551',
      Nombre: 'Cala de La Gruta',
      Municipio: 'Lorca',
      Latitud: '37.490493',
      Longitud: '-1.454182',
      Dirección: '',
      'C.P.': '',
    };

    const normalized = normalize(beach);

    expect(normalized).toEqual({
      code: '551',
      name: 'Cala de La Gruta',
      municipality: 'Lorca',
      coordinates: [37.490493, -1.454182],
    });
  });

  it('should convert selected properties to boolean values', () => {
    const beach = {
      Código: '551',
      Nombre: 'Cala de La Gruta',
      Municipio: 'Lorca',
      Latitud: '37.490493',
      Longitud: '-1.454182',
      'Bandera Azul': 'Sí',
      'Zona Fondeo': 'No',
      Nudista: 'No',
    };

    const normalized = normalize(beach);

    expect(normalized).toEqual({
      code: '551',
      name: 'Cala de La Gruta',
      municipality: 'Lorca',
      blueFlag: true,
      fondingZone: false,
      nudist: false,
      coordinates: [37.490493, -1.454182],
    });
  });

  it('should add fallbacks for beaches with missing coordinates', () => {
    const beach = {
      Código: '7050',
      Nombre: 'Cala Canalicas',
      Dirección: 'Acceso: Carretera de Cope, km 7. Calabardina',
      'C.P.': '30880',
      Municipio: 'Águilas',
      Pedanía: 'CALABARDINA',
    };

    const normalized = normalize(beach);

    expect(normalized).toEqual({
      code: '7050',
      address: 'Acceso: Carretera de Cope, km 7. Calabardina',
      zipCode: '30880',
      district: 'CALABARDINA',
      name: 'Cala Canalicas',
      municipality: 'Águilas',
      coordinates: [37.4318528, -1.5091859],
    });
  });
});
