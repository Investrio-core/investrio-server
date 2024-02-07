import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  type: z.enum(['google', 'credentials']),
  googleAccessToken: z.string().optional()
});

export default loginSchema;

