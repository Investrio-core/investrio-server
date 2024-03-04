import { ParameterizedContext } from 'koa';
import { z } from 'zod';
import requestSchema from './schema';
import { BudgetMonth } from '@prisma/client';

export type State = {
  validatedRequest: z.infer<typeof requestSchema>
  user: {
    id: string
  }
};

export type BudgetMonthToCreate = {
  debts: object[],
  wants: object[],
  savings: object[],
  needs: object[],
  income: number,
  userId: string,
}

export type Body = BudgetMonth | Record<string, never>

export type Context = ParameterizedContext<State, object, Body>
