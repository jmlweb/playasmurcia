import { z } from 'zod';

const removeEmptyString = (x?: string) => (x === '' ? undefined : x);
const removableStringSchema = z.string().transform(removeEmptyString);
const optionalRemovableStringSchema = removableStringSchema.optional();
const yesNoSchema = z.union([z.literal('No'), z.literal('Sí')]).default('No');

export const rawBeachSchema = z
  .object({
    Nombre: z.string(),
    Dirección: optionalRemovableStringSchema,
    'C.P.': optionalRemovableStringSchema,
    Municipio: z.string(),
    Pedanía: optionalRemovableStringSchema,
    Teléfono: optionalRemovableStringSchema,
    Email: optionalRemovableStringSchema,
    'URL Real': optionalRemovableStringSchema,
    'URL Corta': optionalRemovableStringSchema,
    Latitud: removableStringSchema,
    Longitud: removableStringSchema,
    'Zona Fondeo': yesNoSchema,
    Nudista: yesNoSchema,
    Mar: z
      .union([z.literal('Mar Mediterráneo'), z.literal('Mar Menor')])
      .default('Mar Mediterráneo'),
    'Paseo Marítimo': yesNoSchema,
    'Bandera Azul': yesNoSchema,
    Accesible: yesNoSchema,
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
