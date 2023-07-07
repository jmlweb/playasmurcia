import { z } from 'zod';

export const picturesResultsSchema = z.object({
  valid: z.array(z.string()),
  invalid: z.array(z.string()),
});
