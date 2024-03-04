import Koa from 'koa';
import prisma from '../db';

export default async (ctx: Koa.DefaultContext, next: Koa.Next) => {
  const { id: userId } = ctx.state.user;
  const { id } = ctx.params;

  const serviceToModify = await prisma.budgetMonth.findFirst({ where: { id } });

  ctx.state.service = serviceToModify;

  if (serviceToModify?.userId !== userId) {
    ctx.throw(403);
  } else {
    await next();
  }
};
