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

export type Body = BudgetMonth

export type Context = ParameterizedContext<State, object, Body>
