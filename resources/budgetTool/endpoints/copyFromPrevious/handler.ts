import prisma from '../../../../db';
import { BudgetMonthToCreate, Context } from './types';
import logger from '../../../../logger';
import { RequestError } from '../../../../types/http';
import { pick } from 'lodash';

export default async (ctx: Context) => {
  const { id: userId } = ctx.state.user;
  const { month, year } = ctx.state.validatedRequest;
  const currentMonth = Number(month);
  const currentYear = Number(year);

  const previousMonth = currentMonth === 0 ? 11 : month - 1;
  const previousYear = previousMonth === 11 ? currentYear - 1 : currentYear;

  try {
    const currentBudgetMonth = await prisma.budgetMonth.findFirst({
      where: {
        userId, year: currentYear, month: currentMonth
      }
    });

    const previousBudgetMonth = await prisma.budgetMonth.findFirst({
      where: { userId, year: previousYear, month: previousMonth },
    });

    let result;

    if (!previousBudgetMonth && !currentBudgetMonth) {
      ctx.status = 200;
      ctx.body = {};

      return;
    } else if (!previousBudgetMonth && currentBudgetMonth) {
      result = await prisma.budgetMonth.update({
        where: { id: currentBudgetMonth.id },
        data: { debts: [], wants: [], needs: [], savings: [], income: 0, userId: userId, year: currentYear, month: currentMonth },
      });
      ctx.status = 200;
      ctx.body = result;

      return;
    }

    const newBudgetMonth = pick(previousBudgetMonth, [
      'debts',
      'wants',
      'savings',
      'needs',
      'income',
      'userId',
    ]) as BudgetMonthToCreate;

    if (currentBudgetMonth) {
      result = await prisma.budgetMonth.update({
        where: { id: currentBudgetMonth.id },
        data: { ...newBudgetMonth, year: currentYear, month: currentMonth },
      });
    } else {
      result = await prisma.budgetMonth.create({
        data: { ...newBudgetMonth, year: currentYear, month: currentMonth },
      });
    }

    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    const typedError = error as RequestError;
    logger.error(typedError.message);
    ctx.throw(typedError.status, typedError.message);
  } finally {
    await prisma.$disconnect();
  }
};
