import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  type: z.enum(['google', 'credentials']),
  accessToken: z.string().optional()
});

export default signUpSchema;

