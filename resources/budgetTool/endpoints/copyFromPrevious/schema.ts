import { z } from 'zod';

const copyFromPreviousSchema = z.object({
  month: z.number(),
  year: z.number()
});

export default copyFromPreviousSchema;

