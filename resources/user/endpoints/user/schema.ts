import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
});

export default signUpSchema;

