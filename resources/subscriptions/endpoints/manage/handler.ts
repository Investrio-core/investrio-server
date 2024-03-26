import Koa  from 'koa';
import { RequestError } from '../../../../types/http';
import logger from '../../../../logger';
import stripe from '../../../../services/stripe';

export default async (ctx: Koa.Context) => {
  const user = ctx.state.user;

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.WEB_URL}/billing`,
    });
    
    ctx.body = portalSession;
  } catch (error) {
    const typedError = error as RequestError;
    logger.error(typedError.message);
    ctx.throw(typedError.status, { error: typedError.message });
  }
};
