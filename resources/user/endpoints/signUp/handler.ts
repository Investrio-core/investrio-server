import prisma from '../../../../db';
import { signUpContext } from './types';
import bcrypt from 'bcrypt';
import { signJWT } from '../../../../utils/jwt';
import { omit } from 'lodash';
import { RequestError } from '../../../../types/http';

export default async (ctx: signUpContext) => {
  const { name, email, password } = ctx.state.validatedRequest;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      }
    });

    if (existingUser) {
      return ctx.throw(400, 'User already exists');
    }

    const user: {name: string, email: string, password?: string} = {
      name,
      email,
    };

    if (password) {
      const salt = await bcrypt.genSalt(Number(10));
      const hashedPassword = await bcrypt.hash(password, salt);
        
      user.password = hashedPassword; 
    }
    
    const createdUser = await prisma.user.create({
      data: user
    });
    
    // create access token
    const accessToken = await signJWT(
      { id: createdUser.id, email: createdUser.email, name: createdUser.name },
      '15m'
    );
    
    const refreshToken = await signJWT({ id: createdUser.id, email: createdUser.email, name: createdUser.name }, '24h');
            
    ctx.cookies.set('next-auth.refreshToken', refreshToken, {
      maxAge: 60 * 60 * 24 * 1000, // 24h
      httpOnly: true,
    });

    const userToReturn = { ...omit(createdUser, ['password']), accessToken }; 
    ctx.body = JSON.stringify(userToReturn);

  } catch (error) {
    const typedError = error as RequestError;
    ctx.throw(typedError.status, typedError.message);
  }

};
