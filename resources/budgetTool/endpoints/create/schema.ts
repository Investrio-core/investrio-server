import { z } from 'zod';
import { categorySchema } from '../../schema';

const budgetSchema = z.object({
  income: z.number().default(0),
  wants: categorySchema.array().default([]),
  needs: categorySchema.array().default([]),
  savings:categorySchema.array().default([]),
  debts:categorySchema.array().default([]),
  month: z.number(),
  year: z.number()
});

export default budgetSchema;

