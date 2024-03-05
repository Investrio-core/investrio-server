import Koa from 'koa';
import prisma from '../../../db';
import { extraPaymentGraph } from '../utils';

export default async (ctx: Koa.Context) => {
  const { userId } = ctx.params;
  
  try {
    const combined = await extraPaymentGraph(userId);
  
    ctx.body = JSON.stringify(combined);
  } catch (error) {
    ctx.throw(500);
  } finally {
    await prisma.$disconnect();
  }
};
