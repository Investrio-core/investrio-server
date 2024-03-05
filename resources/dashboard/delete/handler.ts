
import Koa from 'koa';

import prisma from '../../../db';
import logger from '../../../logger';

export default async (ctx: Koa.Context) => {
  const { id: userId } = ctx.state.user;

  const body = ctx.request.body as string[];
  
  try{
  
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!userExists) {
      return ctx.throw(401, 'User does not exist' );
    }
  
    await prisma.$transaction(
      [
        prisma.paymentSchedule.deleteMany({
          where: { userId: userId, FinancialRecordId: { in: [...body] } } 
        }),
        prisma.snowballPaymentSchedule.deleteMany({
          where: { userId: userId },
        }),
        prisma.financialRecord.deleteMany({ 
          where: { userId: userId, id: { in: [...body] } },
        }),
      ],
    );

    ctx.status = 202;
    ctx.body={};
  } catch (error) {
    logger.error(error);
    ctx.throw(500, 'Internal server error');
  } finally {
    await prisma.$disconnect();
  }
};
