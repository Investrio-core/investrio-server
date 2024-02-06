import Koa from 'koa';
import prisma from '../../../../db';
import { StepThreeInfo } from '../../utils';

export default async (ctx: Koa.Context) => {
  const { userId } = ctx.params;

  try {
    const data = await StepThreeInfo(userId);
  
    ctx.body = JSON.stringify(data);
  } catch (error) {
    ctx.throw(500);
  } finally {
    await prisma.$disconnect();
  }
};
