import prisma from '../../../../db';
import { signUpContext } from './types';
import bcrypt from 'bcrypt';
import {
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_MAX_AGE,
  signJWT,
} from '../../../../utils/jwt';
import { omit } from 'lodash';
import { RequestError } from '../../../../types/http';
import verifyGoogleToken from '../../../../services/googleTokenVerification';
import logger from '../../../../logger';
import addTrial from './addTrial';

export default async (ctx: signUpContext) => {
  const { email, password, type, googleAccessToken } =
    ctx.state.validatedRequest;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return ctx.throw(400, 'Invalid email or password');
    }

    if (type === 'credentials' && password) {
      if (!existingUser.password) {
        return ctx.throw(400, 'Invalid email or password');
      }
      const verifiedPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!verifiedPassword) {
        return ctx.throw(400, 'Invalid email or password');
      }
    } else if (type === 'credentials' && !password) {
      return ctx.throw(400, 'Invalid email or password');
    }

    if (type === 'google') {
      if (!googleAccessToken) {
        return ctx.throw(400, 'Invalid email or password');
      }

      const isTokenVerified = await verifyGoogleToken(googleAccessToken, email);

      if (!isTokenVerified) {
        return ctx.throw(400, 'Invalid email or password');
      }
    }

    await addTrial(existingUser);

    // create access token
    const accessToken = await signJWT(
      {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
      ACCESS_TOKEN_EXPIRES
    );

    const refreshToken = await signJWT(
      {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
      REFRESH_TOKEN_EXPIRES
    );

    ctx.cookies.set('refreshToken', refreshToken, {
      maxAge: REFRESH_TOKEN_MAX_AGE,
      httpOnly: true,
    });

    const userToReturn = { ...omit(existingUser, ['password']), accessToken };
    ctx.body = JSON.stringify(userToReturn);
  } catch (error) {
    const typedError = error as RequestError;
    logger.error(typedError.message);
    ctx.throw(typedError.status, { error: typedError.message });
  }
};
