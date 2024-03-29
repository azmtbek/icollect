import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string(),
  image: z.string().nullish(),
  status: z.string(),
  isAdmin: z.boolean(),
  createdAt: z.date(),
});

export const createUserSchema = userSchema
  .omit({ id: true });


export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;