import { Context, Next } from 'koa';
import { Logger } from './logger';

export default (logger: Logger) => async (ctx: Context, next: Next) => {
  const startTime = Date.now();
  
  await next();
  
  const responseTime = Date.now() - startTime;
  
  logger.info('', {
    request: {
      method: ctx.request.method,
      url: ctx.request.url,
      userId: ctx.state.currentUser?._id,
      headers: ctx.headers,
    },
    response: {
      status: ctx.status,
    },
    responseTime,
  });
};
