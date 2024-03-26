import Koa from 'koa';
import prisma from '../db';
import moment from 'moment';

export default async (ctx: Koa.DefaultContext, next: Koa.Next) => {
  const { id: userId } = ctx.state.user;

  const user = await prisma.user.findFirst({
    where: { id: userId }
    
  });

  const now = moment();

  if (user && user.isTrial) {
    const expired = now.isAfter(moment(user.trialEndsAt));

    if (expired) {
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          isTrial: false
        }
      });

      ctx.throw(403, JSON.stringify({ subscription: true }));
    }
  }
  
  await next();
};
