import prisma from '../../../../db';
import { Context } from './types';
import logger from '../../../../logger';
import { RequestError } from '../../../../types/http';

export default async (ctx: Context) => {
  const { id: userId } = ctx.state.user;
  const data = ctx.state.validatedRequest;

  try{
    const result = await prisma.budgetMonth.create({
      data: { ...data, userId }
    });
  
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
