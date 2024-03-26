import Koa from 'koa';
import prisma from '../db';
import stripe from '../services/stripe';

export default async (ctx: Koa.DefaultContext, next: Koa.Next) => {
  const { id: userId } = ctx.state.user;

  const user = await prisma.user.findFirst({
    where: { id: userId }
  });

  if (user?.stripeCustomerId) {
    await next();
    return;
  }

  const customer = await stripe.customers.create({
    email: user?.email,
    name: user?.name,
  });

  ctx.state.user.stripeCustomerId = customer.id;

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customer.id,
    }
  });

  await next();

};
