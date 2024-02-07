import { signUpContext } from './types';
import { signJWT, verifyJWT } from '../../../../utils/jwt';
import { omit } from 'lodash';

export default async (ctx: signUpContext) => {
  const cookie = ctx.cookie;
  const refreshToken = cookie?.refreshToken;

  try {
    const { payload: refreshPayload, expired: refreshExpired } = verifyJWT(refreshToken);  

    if (refreshPayload && !refreshExpired) {
      const user = omit(refreshPayload, 'exp', 'iat');

      const newAccessToken = signJWT(user, '3m');
      ctx.body = JSON.stringify({ accessToken: newAccessToken });
    } else {
      ctx.throw(401);
    }

  } catch (error) {
    ctx.throw(500, 'Internal server error');
  }

};
