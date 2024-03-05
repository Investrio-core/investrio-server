import Koa from 'koa';
import prisma from '../../../db';
import logger from '../../../logger';

export default async (ctx: Koa.Context) => {
  const { userId } = ctx.params;

  try {
    const userDebtsPayments = await prisma.snowballPaymentSchedule.findMany({
      where: { userId: userId },
      orderBy: { paymentDate: 'asc' },
      select: {
        paymentDate: true,
        totalInitialBalance: true,
        extraPayAmount: true,
        monthTotalPayment: true,
        totalInterestPaid: true,
        remainingBalance: true,
        data: true,
      },
    });
  
    // Assumption: `debts` is already sorted by `initialBalance` in ascending order due to Prisma's retrieval.
    // Filter out records where monthTotalPayment is 0
    const filteredPayments = userDebtsPayments.filter(
      payment => payment.monthTotalPayment !== 0
    );
  
    // Return the payment schedule
    ctx.body = JSON.stringify(filteredPayments);
  } catch (error) {
    logger.error(error);
    ctx.throw(500);
  } finally {
    await prisma.$disconnect();
  }
};
