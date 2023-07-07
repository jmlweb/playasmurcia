import { z } from 'zod';

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
  blueFlag: z.boolean(),
  features: z.array(
    z.union([
      z.literal('accesible'),
      z.literal('nudista'),
      z.literal('punto-amarre'),
      z.literal('paseo-maritimo'),
    ]),
  ),
  pictures: z.array(z.string()),
  sea: z.union([z.literal(0), z.literal(1)]),
});

export const beachesSchema = z.array(beachSchema);
