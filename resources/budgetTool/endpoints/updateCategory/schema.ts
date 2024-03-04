import { z } from 'zod';
import { categorySchema } from '../../schema';

const budgetSchema = z.object({
  wants: categorySchema.array().optional(),
  needs: categorySchema.array().optional(),
  savings: categorySchema.array().optional(),
  debts: categorySchema.array().optional(),
});

export default budgetSchema;
