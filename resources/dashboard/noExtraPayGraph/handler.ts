import Koa from 'koa';
import prisma from '../../../db';
import { allUserFinancialRecords, paymentGraphForStepTwo } from '../utils';
import { PayScheduleData } from '../interface';

export default async (ctx: Koa.Context) => {
  const { userId } = ctx.params;

  try {
    const records = await allUserFinancialRecords(userId);

    const combined = await paymentGraphForStepTwo(records as PayScheduleData[]);
  
    // Return the payment schedule
    ctx.body = JSON.stringify(combined);
  } catch (error) {
    ctx.throw(500);
  } finally {
    await prisma.$disconnect();
  }
};
