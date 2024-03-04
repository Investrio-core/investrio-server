import { ParameterizedContext } from 'koa';
import { BudgetMonth } from '@prisma/client';

export type State = {
  user: {
    id: string
  }
};

export type Body = BudgetMonth | Record<string, never>

type Params = {
  params: {
    year: number,
    month: number
  }
}

export type Context = ParameterizedContext<State, Params, Body>
