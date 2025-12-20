import { transformCoordinates } from './transform-coordinates';

const TRANSLATIONS = {
  Código: 'code',
  Nombre: 'name',
  Municipio: 'municipality',
  Pedanía: 'district',
  Dirección: 'address',
  'C.P.': 'zipCode',
  Teléfono: 'phone',
  Fax: 'fax',
  Email: 'email',
  'URL Real': 'url',
  'URL Corta': 'shortUrl',
  Oleaje: 'wave',
  Ocupación: 'occupation',
  'Zona Fondeo': 'fondingZone',
  Nudista: 'nudist',
  Mar: 'sea',
  'Paseo Marítimo': 'maritimePromenade',
  'Tipo Acceso': 'accessType',
  'Bandera Azul': 'blueFlag',
  Acceso: 'access',
  Accesible: 'accessible',
  'Tipo Suelo': 'soilType',
} as const;

type SpanishKey = keyof typeof TRANSLATIONS;
type EnglishKey = (typeof TRANSLATIONS)[SpanishKey];

const BOOLEAN_ATTRIBUTES = [
  'Bandera Azul',
  'Zona Fondeo',
  'Nudista',
  'Accesible',
] as const;

type SpanishBooleanAttribute = (typeof BOOLEAN_ATTRIBUTES)[number];
type EnglishBooleanAttribute = (typeof TRANSLATIONS)[SpanishBooleanAttribute];

type RequiredBeachFields = {
  Código: string;
  Nombre: string;
  Municipio: string;
};

type BeachInput = RequiredBeachFields & {
  [K in SpanishKey]?: string;
} & {
  [key: string]: string | undefined;
};

type NormalizedBeach = {
  [K in Exclude<
    EnglishKey,
    EnglishBooleanAttribute | 'pictures' | 'coordinates'
  >]?: string;
} & {
  [K in EnglishBooleanAttribute]: boolean;
} & {
  pictures?: string[];
  coordinates: [number, number];
};

const REPLACEMENTS = {
  'Cala Canalicas': {
    Longitud: '37.4318528',
    Latitud: '-1.5091859',
  },
  'Playa de Gollerón (Cala del Turco)': {
    Longitud: '37.6545228',
    Latitud: '-0.734669',
    Mar: 'Mar Menor',
  },
  'Playa de La Gola': {
    Longitud: '37.6506976',
    Latitud: '-0.7249991',
  },
  'Playa del Saladar': {
    Mar: 'Mar Mediterráneo',
  },
  'Playa El Gachero': {
    Mar: 'Mar Mediterráneo',
  },
} as const;

const addFallbacks = (beach: BeachInput) => {
  const replacement = REPLACEMENTS[beach.Nombre as keyof typeof REPLACEMENTS];
  if (replacement) {
    Object.assign(beach, replacement);
  }
};

const getCoordinates = (beach: BeachInput) => {
  if (!beach.Latitud || !beach.Longitud) {
    throw new Error('No coordinates found');
  }
  if (beach.Latitud < beach.Longitud && Number(beach.Latitud) < 10) {
    return [Number(beach.Longitud), Number(beach.Latitud)] as [number, number];
  }
  if (Number(beach.Longitud) > 10) {
    return transformCoordinates(Number(beach.Longitud), Number(beach.Latitud));
  }
  return [Number(beach.Latitud), Number(beach.Longitud)] as [number, number];
};
export const normalize = (beach: BeachInput): NormalizedBeach => {
  addFallbacks(beach);
  return {
    ...Object.keys(beach).reduce((acc, key) => {
      const value = beach[key];
      if (!value || key === 'Latitud' || key === 'Longitud') {
        return acc;
      }
      if (BOOLEAN_ATTRIBUTES.includes(key as SpanishBooleanAttribute)) {
        acc[TRANSLATIONS[key as SpanishBooleanAttribute]] = value === 'Sí';
        return acc;
      }

      if (key.startsWith('Foto')) {
        if (!acc.pictures) {
          acc.pictures = [];
        }
        acc.pictures.push(
          value.replace(
            /https?:\/\/www\.murciaturistica\.es\/webs\/murciaturistica\/fotos\/1\/playas\//gi,
            '',
          ),
        );
        return acc;
      }

      const translatedKey = TRANSLATIONS[key as SpanishKey] as Exclude<
        EnglishKey,
        EnglishBooleanAttribute | 'pictures'
      >;
      acc[translatedKey] = value;
      return acc;
    }, {} as NormalizedBeach),
    coordinates: getCoordinates(beach),
  };
};
