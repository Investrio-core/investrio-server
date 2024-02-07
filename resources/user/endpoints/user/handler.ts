import { Context } from 'koa';

export default async (ctx: Context) => {
  const user = ctx.state.user;

  if (user) {
    ctx.body = JSON.stringify(user);
  } else {
    ctx.body = JSON.stringify({});
  }
};
