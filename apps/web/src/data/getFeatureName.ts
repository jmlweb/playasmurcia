export const FEATURES = {
  accesible: 'Accesible',
  'bandera-azul': 'Bandera azul',
  nudista: 'Nudista',
  'paseo-maritimo': 'Paseo Marítimo',
  'punto-amarre': 'Punto de amarre',
};

export const getFeatureName = (slug: string) => FEATURES[slug] || slug;
