import Koa from 'koa';
import prisma from '../../../../db';

export default async (ctx: Koa.Context) => {
  const { userId } = ctx.params;

  try {
    const userFinancialRecords = await prisma.financialRecord.findMany({
      where: { userId: userId },
    });
  
    // Return the payment schedule
    ctx.body = JSON.stringify(userFinancialRecords);
  } catch (error) {
    ctx.throw(500);
  } finally {
    await prisma.$disconnect();
  }
};
