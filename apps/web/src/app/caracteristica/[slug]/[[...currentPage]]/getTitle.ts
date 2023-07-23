const TITLES = {
  accesible: 'accesibles',
  'bandera-azul': 'con bandera azul',
  nudista: 'nudistas',
  'paseo-maritimo': 'con paseo marítimo',
  'punto-amarre': 'con punto de amarre',
};

export const getTitle = (slug: string) => TITLES[slug] || slug;
