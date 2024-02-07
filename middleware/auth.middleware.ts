import Koa from 'koa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { verifyJWT } from '../utils/jwt';

export function verifyJwt(token: string) {
  try {
    const secret_key = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secret_key!);
    return decoded as JwtPayload;
  } catch (error) {
    return null;
  }
}

export default async (ctx: Koa.Context, next: Koa.Next) => {

  const accessToken = ctx.headers.authorization?.split(' ')[1];

  console.log('HERE', ctx.headers.authorization, accessToken);

  if (!accessToken) {
    ctx.status = 400;
    ctx.body = { error: 'Unauthorized' };

    return;
  }

  const { payload, expired } = verifyJWT(accessToken);

  console.log(payload, expired);

  if (payload && !expired) {
    ctx.state.user = payload;
    return await next();
  }

  if (expired) {
    ctx.throw(401);
  }

  await next();
};
