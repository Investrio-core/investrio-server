import Koa  from 'koa';
import { RequestError } from '../../../../types/http';
import logger from '../../../../logger';
import stripe from '../../../../services/stripe';

export default async (ctx: Koa.Context) => {
  const user = ctx.state.user;
  
  try {
    const checkout = await stripe.checkout.sessions.create({
      success_url: `${process.env.WEB_URL}/billing?success=true`,
      cancel_url: `${process.env.WEB_URL}/billing?failed=true`,
      customer: user.stripeCustomerId!,
      line_items: [
        {
          price: process.env.STRIPE_PRODUCT_ID, quantity: 1
        }
      ],
      mode: 'subscription',
    });    

    ctx.body = checkout;
  } catch (error) {
    const typedError = error as RequestError;
    logger.error(typedError.message);
    ctx.throw(typedError.status, { error: typedError.message });
  }
};
