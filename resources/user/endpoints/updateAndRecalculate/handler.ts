import Koa from 'koa';
import { ICreateRecordRequestBody } from '../../interface';

import {
  allUserFinancialRecords,
  snowBallPaymentScheduleCalculator,
} from '../../utils';

import prisma from '../../../../db';

export default async (ctx: Koa.Context) => {
  const body = ctx.request.body as ICreateRecordRequestBody[];
  const { id: userId } = ctx.state.user;

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    return ctx.throw(400);
  }

  if (body.length < 0) {
    ctx.body = {};
    return;
  }

  const titles = body.map((item: ICreateRecordRequestBody) => item.debtTitle);
  const uniqueTitles = new Set(titles);
  if (titles.length !== uniqueTitles.size) {
    ctx.throw(
      JSON.stringify({ error: 'Duplicate titles found, cannot add records.' }),
      { status: 400 }
    );
  }

  const dataToUpdate = body.filter(el => {
    if (el.id) {
      return true;
    }
  });

  if (dataToUpdate.length) {
    await Promise.all(
      dataToUpdate.map(d =>
        prisma.financialRecord.update({
          where: {
            id: d.id,
          },
          data: {
            title: d.debtTitle,
            interestRate: d.interestRate,
            initialBalance: d.initialBalance,
            minPayAmount: d.minPayAmount,
          },
        })
      )
    );

    await Promise.all(
      dataToUpdate.map(d =>
        prisma.paymentSchedule.deleteMany({
          where: {
            FinancialRecordId: d.id,
          },
        })
      )
    );
  }

  const dataForCreation = body
    .filter(el => {
      if (!el.id) {
        return true;
      }
    })
    .map((debtRecord: ICreateRecordRequestBody) => ({
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

  await Promise.all(
    dataForCreation.map(d =>
      prisma.financialRecord.upsert({
        where: {
          title_userId: {
            userId,
            title: d.title,
          },
        },
        update: {
          title: d.title,
          initialBalance: d.initialBalance,
          interestRate: d.interestRate,
          minPayAmount: d.minPayAmount,
        },
        create: {
          title: d.title,
          initialBalance: d.initialBalance,
          interestRate: d.interestRate,
          type: d.type,
          minPayAmount: d.minPayAmount,
          periodicity: d.periodicity,
          payDueDate: d.payDueDate,
          extraPayAmount: d.extraPayAmount,
          userId: d.userId,
        },
      })
    )
  );

  // await prisma.financialRecord.upsert({
  //   where: {
  //     userId: userId
  //   }
  //   data: dataForCreation,
  //   skipDuplicates: true,
  // });

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

      return prisma.$transaction(
        dataToCreate.map(data =>
          prisma.paymentSchedule.upsert({
            where: {
              paymentDate_title_userId: {
                paymentDate: data.paymentDate,
                title: data.title,
                userId: data.userId,
              },
            },
            create: { ...data },
            update: { ...data },
          })
        )
      );
    });

    try {
      // Execute all save operations in parallel
      await Promise.all(saveTasks);
      const waitForResult = await snowBallPaymentScheduleCalculator(
        userId,
        ctx
      );

      // eslint-disable-next-line no-unused-expressions
      await waitForResult;
      ctx.body = JSON.stringify(recordsResponse);
    } catch (error) {
      // Handle the error by returning or logging
      console.log(error);
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
    console.log(error);
    ctx.throw(500, JSON.stringify({ error: 'Internal server error' }));
  } finally {
    await prisma.$disconnect();
  }
};
