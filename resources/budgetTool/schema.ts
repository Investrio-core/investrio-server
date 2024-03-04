import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string(),
  value: z.number(),
});

const budgetMonth = z.object({
  id: z.string(),
  userId: z.string(),
  income: z.number(),
  needs: categorySchema.array(),
  wants: categorySchema.array(),
  savings: categorySchema.array(),
  debts: categorySchema.array(),
  date: z.string().datetime(),
  month: z.number(),
  year: z.number(),
});

export type BudgetMonth = z.infer<typeof budgetMonth>

export default budgetMonth;
