import prisma from '../../../../db';
import { signUpContext } from './types';
import bcrypt from 'bcrypt';
import { signJWT } from '../../../../utils/jwt';
import { omit } from 'lodash';
import { RequestError } from '../../../../types/http';
import verifyGoogleToken from '../../../../services/googleTokenVerification';
import logger from '../../../../logger';

export default async (ctx: signUpContext) => {
  const { email, password, type, googleAccessToken } = ctx.state.validatedRequest;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      }
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

      if (!verifiedPassword){
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
   
    const accessToken = await signJWT(
      { id: existingUser.id, email: existingUser.email, name: existingUser.name },
      '15m'
    );

    const refreshToken = await signJWT({ id: existingUser.id, email: existingUser.email, name: existingUser.name }, '24h');

    ctx.cookies.set('refreshToken', refreshToken, {
      maxAge: 60 * 60 * 24 * 1000, // 24h
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
