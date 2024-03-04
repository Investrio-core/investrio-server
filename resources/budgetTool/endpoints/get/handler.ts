import prisma from '../../../../db';
import { Context } from './types';
import logger from '../../../../logger';

export default async (ctx: Context) => {
  const { id: userId } = ctx.state.user;
  const { year, month } = ctx.params;

  try {
    const result = await prisma.budgetMonth.findFirst({
      where: {
        userId,
        year: Number(year),
        month: Number(month),
      },
    });

    if (result) {
      ctx.status = 200;
      ctx.body = result;

      return;
    }

    ctx.body = {};
  } catch (error) {
    logger.error(error);
    ctx.throw(500, 'Internal server error');
  } finally {
    await prisma.$disconnect();
  }
};
