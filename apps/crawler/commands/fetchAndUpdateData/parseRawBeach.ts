import * as RA from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { constant, constUndefined, flow, pipe, tupled } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';
import * as TU from 'fp-ts/Tuple';

import { capitalize, slugify } from '@/lib';
import { Beach, RawBeach } from '@/lib/schemas';

import { utmToLatLng } from './utmToLatLng';

const PICTURES_PREFIX_REGEX =
  /https?:\/\/www\.murciaturistica\.es\/webs\/murciaturistica\/fotos\/1\/playas\//gi;

const PARSED_FEATURES = {
  Accesible: 'accesible',
  Nudista: 'nudista',
  'Zona Fondeo': 'punto-amarre',
  'Paseo Marítimo': 'paseo-maritimo',
} as const;

const isYes = (x: unknown) => S.isString(x) && S.Eq.equals(x, 'Sí');

const extractFeatures = (rawBeach: RawBeach): Beach['features'] =>
  pipe(
    ['Accesible', 'Nudista', 'Zona Fondeo', 'Paseo Marítimo'],
    RA.filterMap((key) =>
      pipe(
        rawBeach[key as keyof RawBeach],
        O.fromPredicate(isYes),
        O.map(constant(PARSED_FEATURES[key as keyof typeof PARSED_FEATURES])),
      ),
    ),
  );

const extractPosition = ({ Latitud: lat, Longitud: lng }: RawBeach) =>
  pipe(
    [lng, lat] as [string, string],
    TU.bimap(Number, Number),
    E.fromPredicate(
      flow(TU.snd, (lat) => lat < 10),
      flow(
        tupled(utmToLatLng),
        ({ lat, lng }) => [lat, lng] as Beach['position'],
      ),
    ),
    E.toUnion,
  );

const transformation = {
  slug: ({ Nombre }: RawBeach) => slugify(Nombre),
  name: ({ Nombre }: RawBeach) => Nombre,
  municipality: ({ Municipio }: RawBeach) => Municipio,
  position: extractPosition,
  sea: ({ Mar }: RawBeach) => (Mar === 'Mar Menor' ? 1 : 0),
  blueFlag: ({ 'Bandera Azul': blueFlag }: RawBeach) => isYes(blueFlag),
  features: extractFeatures,
  address: ({ Dirección: address }: RawBeach) => address,
  postalCode: ({ 'C.P.': postalCode }: RawBeach) => postalCode,
  district: ({ Pedanía: district }: RawBeach) => district,
  phone: ({ Teléfono: phone }: RawBeach) => phone,
  email: ({ Email: email }: RawBeach) => email,
  url: ({ 'URL Real': urlReal, 'URL Corta': urlShort }: RawBeach) =>
    urlReal || urlShort,
  groundType: ({ 'Tipo Suelo': groundType }: RawBeach) =>
    groundType && capitalize(groundType),
  waveType: ({ Oleaje: waveType }: RawBeach) =>
    waveType && capitalize(waveType),
  occupation: ({ Ocupación: occupation }: RawBeach) => occupation,
  access: ({ Acceso: access }: RawBeach) => access,
  pictures: (rawBeach: RawBeach) =>
    pipe(
      [
        'Foto 1',
        'Foto 2',
        'Foto 3',
        'Foto 4',
        'Foto 5',
        'Foto 6',
        'Foto 7',
        'Foto 8',
        'Foto 9',
        'Foto 10',
      ],
      RA.filterMap((key) =>
        pipe(
          rawBeach[key as keyof RawBeach],
          O.fromNullable,
          O.map(S.replace(PICTURES_PREFIX_REGEX, '')),
        ),
      ),
      O.fromPredicate(RA.isNonEmpty),
      O.getOrElseW(constUndefined),
    ),
} as const;

const transformationKeys = Object.keys(transformation) as Array<
  keyof typeof transformation
>;
export const parseRawBeach = (rawBeach: RawBeach) =>
  pipe(
    transformationKeys,
    RA.reduce({} as Beach, (beach, key) =>
      pipe(
        transformation[key](rawBeach),
        O.fromNullable,
        O.match(
          () => beach,
          (value) => ({ ...beach, [key]: value }),
        ),
      ),
    ),
  );
