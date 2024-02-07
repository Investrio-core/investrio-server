import Koa from 'koa';

export default async (ctx: Koa.Context) => {
  ctx.body = { state: 'alive' };
};
