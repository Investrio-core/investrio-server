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
import moment from 'moment';
import stripe from '../../../../services/stripe';

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

    const customer = await stripe.customers.create({
      email: user?.email,
      name: user?.name,
    });

    const trialSubscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: process.env.STRIPE_PRODUCT_ID,
        },
      ],
      
      trial_period_days: 7,
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel',
        },
      },
    });

    const createdUser = await prisma.user.create({
      data: {
        ...user,
        stripeCustomerId: customer.id,
        isTrial: true,
        isActive: false,
        trialEndsAt: moment(trialSubscription.trial_end! * 1000).toISOString(),
      },
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
    });

    const userToReturn = { ...omit(createdUser, ['password']), accessToken };
    ctx.body = JSON.stringify(userToReturn);
  } catch (error) {
    const typedError = error as RequestError;
    ctx.throw(typedError.status, typedError.message);
  }
};
