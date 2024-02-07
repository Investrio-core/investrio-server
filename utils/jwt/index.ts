import jwt, { VerifyErrors } from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY as string;

interface Payload {
    id: string,
    email: string,
    name: string,
}

export const signJWT = (payload: Payload, expiresIn: string | number) => jwt.sign(payload, SECRET_KEY, { expiresIn }); 

export const verifyJWT = (token: string): {payload: Payload | null, expired: boolean} => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as Payload;
    return { payload: decoded, expired: false };
  } catch (error) {
    const typedError = error as VerifyErrors;
    return { payload: null, expired: typedError.message.includes('jwt expired') };
  }
};
