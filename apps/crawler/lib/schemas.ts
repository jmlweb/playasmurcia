import { z } from 'zod';

const removeEmptyString = (x?: string) => (x === '' ? undefined : x);

export const rawBeachSchema = z
  .object({
    Nombre: z.string(),
    Dirección: z.string().optional().transform(removeEmptyString),
    'C.P.': z.string().optional().transform(removeEmptyString),
    Municipio: z.string(),
    Pedanía: z.string().optional().transform(removeEmptyString),
    Teléfono: z.string().optional().transform(removeEmptyString),
    Email: z.string().optional().transform(removeEmptyString),
    'URL Real': z.string().optional().transform(removeEmptyString),
    'URL Corta': z.string().optional().transform(removeEmptyString),
    Latitud: z.string().transform(removeEmptyString),
    Longitud: z.string().transform(removeEmptyString),
    'Tipo Suelo': z.string().optional().transform(removeEmptyString),
    Oleaje: z.string().optional().transform(removeEmptyString),
    Ocupación: z
      .union([z.literal('Bajo'), z.literal('Medio'), z.literal('Alto')])
      .optional()
      .transform(removeEmptyString),
    'Zona Fondeo': z.union([z.literal('No'), z.literal('Sí')]).default('No'),
    Nudista: z.union([z.literal('No'), z.literal('Sí')]).default('No'),
    Mar: z
      .union([z.literal('Mar Mediterráneo'), z.literal('Mar Menor')])
      .default('Mar Mediterráneo'),
    'Paseo Marítimo': z.union([z.literal('No'), z.literal('Sí')]).default('No'),
    'Tipo Acceso': z.string().optional().transform(removeEmptyString),
    'Bandera Azul': z.union([z.literal('No'), z.literal('Sí')]).default('No'),
    Acceso: z.string().optional().transform(removeEmptyString),
    Accesible: z.union([z.literal('No'), z.literal('Sí')]).default('No'),
    'Foto 1': z.string().optional().transform(removeEmptyString),
    'Foto 2': z.string().optional().transform(removeEmptyString),
    'Foto 3': z.string().optional().transform(removeEmptyString),
    'Foto 4': z.string().optional().transform(removeEmptyString),
    'Foto 5': z.string().optional().transform(removeEmptyString),
    'Foto 6': z.string().optional().transform(removeEmptyString),
    'Foto 7': z.string().optional().transform(removeEmptyString),
    'Foto 8': z.string().optional().transform(removeEmptyString),
    'Foto 9': z.string().optional().transform(removeEmptyString),
    'Foto 10': z.string().optional().transform(removeEmptyString),
  })
  .transform((x) =>
    Object.entries(x).reduce((acc, [key, value]) => {
      if (typeof value === 'undefined') {
        return acc;
      }
      return {
        ...acc,
        [key]: value,
      };
    }, {} as typeof x),
  );

export type RawBeach = z.infer<typeof rawBeachSchema>;

export const arrayOfThingsSchema = z.array(z.any());

export const arrayOfRawBeachesSchema = z.array(rawBeachSchema);

export const beachSchema = z.object({
  name: z.string(),
  slug: z.string(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  municipality: z.string(),
  district: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  url: z.string().optional(),
  position: z.tuple([z.number(), z.number()]),
  groundType: z.string().optional(),
  waveType: z.string().optional(),
  occupation: z.union([
    z.literal('Bajo'),
    z.literal('Medio'),
    z.literal('Alto'),
  ]),
  blueFlag: z.boolean(),
  features: z.array(
    z.union([
      z.literal('accesible'),
      z.literal('nudista'),
      z.literal('punto-amarre'),
      z.literal('paseo-maritimo'),
    ]),
  ),
  access: z.string().optional(),
  pictures: z.array(z.string()),
  sea: z.union([z.literal(1), z.literal(0)]),
});

export type Beach = z.infer<typeof beachSchema>;

export const arrayOfBeachesSchema = z.array(beachSchema);

export const arrayOfStrings = z.array(z.string());
