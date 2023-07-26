const weatherTitles = {
  '0': 'Cielo despejado',
  '1': 'Principalmente despejado',
  '2': 'Parcialmente nublado',
  '3': 'Cubierto',
  '45': 'Niebla',
  '48': 'Escarcha',
  '51': 'Llovizna ligera',
  '53': 'Llovizna moderada',
  '55': 'Llovizna intensa',
  '56': 'Llovizna helada ligera',
  '57': 'Llovizna helada intensa',
  '61': 'Lluvia ligera',
  '63': 'Lluvia moderada',
  '65': 'Lluvia intensa',
  '66': 'Lluvia helada ligera',
  '67': 'Lluvia helada intensa',
  '71': 'Caída de nieve ligera',
  '73': 'Caída de nieve moderada',
  '75': 'Caída de nieve intensa',
  '77': 'Granos de nieve',
  '80': 'Chubascos de lluvia ligera',
  '81': 'Chubascos de lluvia moderada',
  '82': 'Chubascos de lluvia intensa',
  '85': 'Chubascos de nieve ligera',
  '86': 'Chubascos de nieve intensa',
  '95': 'Tormenta ligera o moderada',
  '96': 'Tormenta con granizo ligero',
  '99': 'Tormenta con granizo intenso',
};

export const getWeatherTitle = (code: number | string) =>
  weatherTitles[`${code}`] || 'Desconocido';
