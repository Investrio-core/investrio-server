import Koa from 'koa';
import { IEditExtraRequestBody } from '../interface';

import {
  snowBallPaymentScheduleCalculator,
} from '../utils';
import logger from '../../../logger';

import prisma from '../../../db';

export default async (ctx: Koa.Context) => {
  const body = ctx.request.body as IEditExtraRequestBody;
  const { id: userId } = ctx.state.user;

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    return ctx.throw(400);
  }

  await prisma.financialRecord.updateMany({
    where: {
      userId,
    },
    data: {
      extraPayAmount: body.extraPayAmount,
    },
  });

  await prisma.snowballPaymentSchedule.deleteMany({ where: { userId } });
  await prisma.paymentSchedule.updateMany({ 
    where: { userId },
    data: {
      extraPayAmount: body.extraPayAmount
    }
  });

  try {
    try {
      const waitForResult = await snowBallPaymentScheduleCalculator(
        userId,
        ctx
      );

      await waitForResult;
      ctx.body = JSON.stringify({ done: true });
    } catch (error) {
      logger.error(error);
      ctx.throw(
        400,
        JSON.stringify({
          error: 'Failed when trying to save financial records.',
        })
      );
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    logger.error(error);
    ctx.throw(500, JSON.stringify({ error: 'Internal server error' }));
  } finally {
    await prisma.$disconnect();
  }
};
