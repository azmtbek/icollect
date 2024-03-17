import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { nanoid } from 'nanoid';

export const userRouter = createTRPCRouter({

  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (eq(users.email, input.email))
      });
      return user;
    }),
  create: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(2),
    }))
    .mutation(async ({ ctx, input }) => {
      const salt = genSaltSync(10);
      const hash = hashSync(input.password, salt);
      const theId = nanoid(13);
      await ctx.db.insert(users).values({
        id: theId,
        name: input.name,
        password: hash,
        email: input.email,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
