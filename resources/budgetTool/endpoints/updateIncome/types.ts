import { ParameterizedContext } from 'koa';
import { z } from 'zod';
import schema from './schema';
import { BudgetMonth } from '@prisma/client';

export type State = {
  validatedRequest: z.infer<typeof schema>
  user: {
    id: string
  }
};

type Params = {
  params: {
    id: string
  }
}

export type Context = ParameterizedContext<State, Params, BudgetMonth>
