import { parseRawBeach } from './parseRawBeach';

describe('parseRawBeach', () => {
  it('should return a beach with the correct values', () => {
    expect(
      parseRawBeach({
        Nombre: 'Cala Aguilar',
        Dirección: '',
        'C.P.': '',
        Municipio: 'Cartagena',
        Pedanía: '',
        Teléfono: '',
        Email: '',
        'URL Real': '',
        'URL Corta': '',
        Latitud: '4159839',
        Longitud: '667686',
        'Zona Fondeo': 'No',
        Nudista: 'No',
        Mar: 'Mar Mediterráneo',
        'Paseo Marítimo': 'No',
        'Bandera Azul': 'No',
        Accesible: 'No',
        'Foto 1':
          'http://www.murciaturistica.es/webs/murciaturistica/fotos/1/playas/recurso-1-601-1p_g.jpg',
      }),
    ).toEqual({
      slug: 'cala-aguilar',
      name: 'Cala Aguilar',
      municipality: 'Cartagena',
      position: [37.570334132325065, -1.1011940180602702],
      sea: 0,
      blueFlag: false,
      features: [],
      pictures: ['recurso-1-601-1p_g.jpg'],
    });
  });
});
