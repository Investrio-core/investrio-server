
import Koa from 'koa';
import { ICreateRecordRequestBody } from '../interface';
import {
  allUserFinancialRecords,
  snowBallPaymentScheduleCalculator,
} from '../utils';
import logger from '../../../logger';

import prisma from '../../../db';

export default async (ctx: Koa.Context) => {
  const body = ctx.request.body as ICreateRecordRequestBody[];
  const { id: userId } = ctx.state.user;

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    return ctx.throw(400);
  }

  const titles = body.map((item: ICreateRecordRequestBody) => item.debtTitle);
  const uniqueTitles = new Set(titles);
  if (titles.length !== uniqueTitles.size) {
    ctx.throw(
      JSON.stringify({ error: 'Duplicate titles found, cannot add records.' }),
      { status: 400 }
    );
  }

  const dataForCreation = body.map((debtRecord: ICreateRecordRequestBody) => ({
    interestRate: debtRecord.interestRate,
    title: debtRecord.debtTitle,
    type: debtRecord.debtType,
    periodicity: debtRecord.periodicity,
    initialBalance: debtRecord.initialBalance,
    minPayAmount: debtRecord.minPayAmount,
    payDueDate: new Date(),
    extraPayAmount: debtRecord.extraPayAmount,
    userId: debtRecord.userId,
  }));

  await prisma.financialRecord.createMany({
    data: dataForCreation,
    skipDuplicates: true,
  });

  try {
    const recordsResponse = await allUserFinancialRecords(userId);
    if ('error' in recordsResponse) {
      ctx.throw(201, 'Record Created Successfully.');
    }
    const saveTasks = recordsResponse.flatMap(record => {
      const dataToCreate = record.data.map(payment => ({
        FinancialRecordId: record.id,
        userId: userId,
        title: record.title,
        extraPayAmount: record.extraPayAmount,
        paymentDate: new Date(payment.currentDate),
        monthlyInterestPaid: payment.monthlyInterestPaid,
        monthlyPayment: payment.monthlyPayment,
        remainingBalance: payment.remainingBalance,
        minPayAmount: record.minPayAmount,
      }));

      return prisma.paymentSchedule.createMany({
        data: dataToCreate,
        skipDuplicates: true
      });
    });
    try {
      // Execute all save operations in parallel
      await Promise.all(saveTasks);
      const waitForResult = await snowBallPaymentScheduleCalculator(userId, ctx);

      // eslint-disable-next-line no-unused-expressions
      await waitForResult;
      ctx.body = JSON.stringify(recordsResponse);
    } catch (error) {
      // Handle the error by returning or logging
      ctx.throw(400, JSON.stringify({ error: 'Failed when trying to save financial records.' }),
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
