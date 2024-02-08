import prisma from '../../../../db';
import { signUpContext } from './types';
import bcrypt from 'bcrypt';
import {
  signJWT,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_MAX_AGE,
} from '../../../../utils/jwt';
import { omit } from 'lodash';
import { RequestError } from '../../../../types/http';

export default async (ctx: signUpContext) => {
  const { name, email, password } = ctx.state.validatedRequest;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return ctx.throw(400, 'User already exists');
    }

    const user: { name: string; email: string; password?: string } = {
      name,
      email,
    };

    if (password) {
      const salt = await bcrypt.genSalt(Number(10));
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;
    }

    const createdUser = await prisma.user.create({
      data: user,
    });

    // create access token
    const accessToken = await signJWT(
      { id: createdUser.id, email: createdUser.email, name: createdUser.name },
      ACCESS_TOKEN_EXPIRES
    );

    const refreshToken = await signJWT(
      { id: createdUser.id, email: createdUser.email, name: createdUser.name },
      REFRESH_TOKEN_EXPIRES
    );

    ctx.cookies.set('refreshToken', refreshToken, {
      maxAge: REFRESH_TOKEN_MAX_AGE,
      httpOnly: true,
      sameSite: true,
      secure: process.env.ENV === 'production' ? true : false,
    });

    const userToReturn = { ...omit(createdUser, ['password']), accessToken };
    ctx.body = JSON.stringify(userToReturn);
  } catch (error) {
    const typedError = error as RequestError;
    ctx.throw(typedError.status, typedError.message);
  }
};
