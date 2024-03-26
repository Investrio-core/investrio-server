/* eslint-disable no-case-declarations */
import Koa from 'koa';
import prisma from '../../../../db';
import { RequestError } from '../../../../types/http';
import logger from '../../../../logger';
import stripe from '../../../../services/stripe';
import moment from 'moment';

const STRIPE_WEBHOOK = process.env.STRIPE_WEBHOOK as string;

export default async (ctx: Koa.Context) => {
  const sig = ctx.req.headers['stripe-signature'] as string;

  try {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        ctx.request.rawBody,
        sig,
        STRIPE_WEBHOOK
      );
    } catch (err) {
      ctx.status = 400;
      ctx.body = '';
      return;
    }
    const data = event.data.object as {
      customer: string;
      canceled_at?: number;
      current_period_end: number;
      current_period_start: number;
      status: string;
      period_end: number;
      total: number;
    };

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: data.customer },
    });

    switch (event.type) {
      case 'invoice.paid': {
        if (user && data.total > 0) {
          const trialSubscription = await stripe.subscriptions.list({
            customer: user.stripeCustomerId!,
            status: 'trialing',
          });

          if (trialSubscription.data.length > 0) {
            const id = trialSubscription.data[0].id;

            await stripe.subscriptions.cancel(id, {});
          }

          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              subscriptionStatus: 'active',
              subscriptionStartedOn: moment(
                data.period_end * 1000
              ).toISOString(),
              isActive: true,
              isTrial: false,
            },
          });
        }
        logger.info(`Handle event type ${event.type}`);

        break;
      }

      case 'customer.subscription.updated': {
        if (data.status === 'active') {
          if (user) {
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                subscriptionStatus: 'active',
              },
            });
          }
        }

        if (
          data?.canceled_at &&
          !event.data.object.trial_start
        ) {
          if (user) {
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                subscriptionStatus: 'cancelled',
                subscriptionCancelAt: moment(
                  data.current_period_end * 1000
                ).toISOString(),
              },
            });
          }
        }

        logger.info(`Handle event type ${event.type}`);

        break;
      }

      case 'customer.subscription.deleted': {
        if (user) {
          const listSubs = await stripe.subscriptions.list({
            customer: user.stripeCustomerId!,
            status: 'all',
          });

          if (
            (listSubs.data.length > 1 && !event.data.object.trial_start) ||
            listSubs.data.length === 1
          ) {
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                isActive: false,
                isTrial: false,
                subscriptionStatus: 'cancelled',
                subscriptionCancelAt: null,
              },
            });
          }
        }

        logger.info(`Handle event type ${event.type}`);

        break;
      }

      case 'invoice.payment_failed': {
        const { status } = data;

        if (user) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              isActive: status === 'canceled' || !user.isActive ? false : true,
              isTrial: false,
              subscriptionStatus:
                status === 'canceled' ? 'cancelled' : 'failed',
              subscriptionCancelAt: null,
            },
          });
        }

        logger.info(`Handle event type ${event.type}`);

        break;
      }

      case 'customer.deleted': {
        if (user) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              stripeCustomerId: null,
            },
          });
        }

        logger.info(`Handle event type ${event.type}`);

        break;
      }

      default:
        logger.error(`Unhandled event type ${event.type}`);
    }

    ctx.status = 200;
    ctx.body = {};
  } catch (error) {
    const typedError = error as RequestError;
    logger.error(typedError.message);
    ctx.throw(typedError.status, { error: typedError.message });
  }
};
