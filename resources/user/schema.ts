import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  createdAt: z.string(),
  lastLogin: z.date(),
});
