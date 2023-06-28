import { z } from 'zod';

const imageList = z.array(z.string()).optional().default([]);

export const picturesByStatusSchema = z
  .object({
    valid: imageList,
    invalid: imageList,
  })
  .optional()
  .default({ valid: [], invalid: [] });

export type PicturesByStatus = z.infer<typeof picturesByStatusSchema>;
