import { z } from 'zod';

const budgetSchema = z.object({
  income: z.number()
});

export default budgetSchema;
