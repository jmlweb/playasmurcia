export const MUNICIPALITIES = {
  aguilas: 'Águilas',
  cartagena: 'Cartagena',
  'la-manga': 'La Manga',
  'la-union': 'La Unión',
  lorca: 'Lorca',
  'los-alcazares': 'Los Alcázares',
  mazarron: 'Mazarrón',
  'san-javier': 'San Javier',
  'san-pedro-del-pinatar': 'San Pedro del Pinatar',
};

export const getMunicipalityName = (slug: string) =>
  MUNICIPALITIES[slug] || slug;
