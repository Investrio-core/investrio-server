import prisma from '../../../../db';
import { Context } from './types';
import logger from '../../../../logger';

export default async (ctx: Context) => {
  const { id } = ctx.params;
  const data = ctx.state.validatedRequest;

  try{
    const result = await prisma.budgetMonth.update({
      where: { id },
      data: { ...data }
    });
  
    ctx.status = 200;
    ctx.body= result;
  } catch (error) {
    logger.error(error);
    ctx.throw(500, 'Internal server error');
  } finally {
    await prisma.$disconnect();
  }
};
