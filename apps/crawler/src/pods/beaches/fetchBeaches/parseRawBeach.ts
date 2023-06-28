import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { constant, flow, pipe, tupled } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as S from 'fp-ts/string';
import * as TU from 'fp-ts/Tuple';

import { slugify } from '@/pods/utils';

import { Beach, RawBeach } from '../schemas';
import { utmToLatLng } from './utmToLatLng';

const PARSED_FEATURES = {
  Accesible: 'accesible',
  Nudista: 'nudista',
  'Zona Fondeo': 'punto-amarre',
  'Paseo Marítimo': 'paseo-maritimo',
} as const;

const isYes = S.startsWith('Sí');

const extractFeatures = (rawBeach: RawBeach): Beach['features'] =>
  pipe(
    R.keys(PARSED_FEATURES),
    A.filterMap((key) =>
      pipe(
        rawBeach[key],
        O.fromPredicate(isYes),
        O.map(constant(PARSED_FEATURES[key])),
      ),
    ),
  );

const extractPosition = ({ Latitud: lat, Longitud: lng }: RawBeach) =>
  pipe(
    [lng, lat] as [string, string],
    TU.bimap(Number, Number),
    E.fromPredicate(
      (lat) => TU.snd(lat) < 10,
      flow(
        tupled(utmToLatLng),
        ({ lat, lng }) => [lat, lng] as Beach['position'],
      ),
    ),
    E.toUnion,
  );

const picturesKeys = A.makeBy(10, (index) => `Foto ${index + 1}`);

const extractPictures = (rawBeach: RawBeach): Beach['pictures'] =>
  pipe(
    picturesKeys,
    A.filterMap((key) =>
      pipe(
        rawBeach[key as keyof RawBeach],
        O.fromNullable,
        O.map(
          S.replace(
            /https?:\/\/www\.murciaturistica\.es\/webs\/murciaturistica\/fotos\/1\/playas\//gi,
            '',
          ),
        ),
      ),
    ),
  );

const transformations = {
  slug: ({ Nombre }: RawBeach) => slugify(Nombre),
  name: ({ Nombre }: RawBeach) => Nombre,
  municipality: ({ Municipio }: RawBeach) => Municipio,
  position: extractPosition,
  sea: ({ Mar }: RawBeach) => (Mar === 'Mar Menor' ? 1 : 0),
  blueFlag: ({ 'Bandera Azul': blueFlag }: RawBeach) => isYes(blueFlag),
  features: extractFeatures,
  address: ({ Dirección: address, Pedanía: district }: RawBeach) =>
    district ? `${address} (${district})` : address,
  postalCode: ({ 'C.P.': postalCode }: RawBeach) => postalCode,
  district: ({ Pedanía: district }: RawBeach) => district,
  phone: ({ Teléfono: phone }: RawBeach) => phone,
  email: ({ Email: email }: RawBeach) => email,
  url: ({ 'URL Real': urlReal, 'URL Corta': urlShort }: RawBeach) =>
    urlReal || urlShort,
  pictures: extractPictures,
} as const;

const isValid = (value: unknown) => value !== '';

export const parseRawBeach = (rawBeach: RawBeach): Beach =>
  pipe(
    R.toEntries(transformations),
    A.reduce({} as Beach, (acc, [key, transformation]) =>
      pipe(
        transformation(rawBeach),
        O.fromNullable,
        O.chain(O.fromPredicate(isValid)),
        O.match(
          () => acc,
          (value) => ({ ...acc, [key]: value }),
        ),
      ),
    ),
  );
