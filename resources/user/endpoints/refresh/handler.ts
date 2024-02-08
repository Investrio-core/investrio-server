import { signUpContext } from './types';
import { ACCESS_TOKEN_EXPIRES, signJWT, verifyJWT } from '../../../../utils/jwt';
import { omit } from 'lodash';
import logger from '../../../../logger';

export default async (ctx: signUpContext) => {
  console.log('object');

  const cookie = ctx.cookie;

  const refreshToken = cookie?.refreshToken;
  console.log(ctx.cookies.get('refreshToken'));
  console.log(ctx.request.headers);
  console.log(cookie);

  console.log(refreshToken);

  try {
    const { payload: refreshPayload, expired: refreshExpired } = verifyJWT(refreshToken);  

    console.log(refreshExpired);
    console.log(refreshPayload);

    if (refreshPayload && !refreshExpired) {
      const user = omit(refreshPayload, 'exp', 'iat');

      const newAccessToken = signJWT(user, ACCESS_TOKEN_EXPIRES);
      ctx.body = JSON.stringify({ accessToken: newAccessToken });
    } else {
      ctx.throw(401);
    }

  } catch (error) {
    console.log(error);
    logger.error(error);
    ctx.throw(500, 'Internal server error');
  }

};
