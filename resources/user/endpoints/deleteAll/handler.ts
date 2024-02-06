
import Koa from 'koa';

import prisma from '../../../../db';

export default async (ctx: Koa.Context) => {

  const { id: userId } = ctx.state.user;
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
          where: { userId: userId } 
        }),
        prisma.snowballPaymentSchedule.deleteMany({
          where: { userId: userId },
        }),
        prisma.financialRecord.deleteMany({ 
          where: { userId: userId },
        }),
      ],
    );

    ctx.status = 202;
    ctx.body={};
  } catch (error) {
    console.log(error);
    ctx.throw(500, JSON.stringify({ error: 'Internal server error' }));
  } finally {
    await prisma.$disconnect();
  }
};
