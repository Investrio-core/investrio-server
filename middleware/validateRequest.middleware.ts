import Koa from 'koa';
import { Schema } from 'zod';

const validateMiddleware = (validator: Schema) =>
  async function (ctx: Koa.DefaultContext, next: Koa.Next) {
    const payload = { ...ctx.request.body };
    
    const result = await validator.safeParse(payload);

    if (result.success) {
      ctx.state.validatedRequest = result.data;
      await next();
    } else {
      ctx.throw(400, result.error);
    }
  };

export default validateMiddleware;
