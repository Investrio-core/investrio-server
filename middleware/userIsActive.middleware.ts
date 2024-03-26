import Koa from 'koa';

export default async (ctx: Koa.Context, next: Koa.Next) => {
  const user = ctx.state.user;

  if (user?.isActive || user?.isTrial) {
    await next();
    return;
  }

  ctx.throw(403, JSON.stringify({ subscription: true }));
};
