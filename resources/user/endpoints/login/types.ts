import { ParameterizedContext } from 'koa';
import { z } from 'zod';
import signUpSchema from './schema';

export type State = {
  validatedRequest: z.infer<typeof signUpSchema>
};

export type signUpContext = ParameterizedContext<State, object, string>
