import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { nanoid } from 'nanoid';
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.query.users.findMany();
      return user;
    }),
  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (eq(users.email, input.email))
      });
      return user;
    }),
  getCurrent: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.session || !ctx.session.user || !ctx.session.user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
      return ctx.db.query.users.findFirst({
        columns: {
          id: true,
          email: true,
          isAdmin: true,
          name: true,
          image: true,
          status: true,
        },
        where: eq(users.email, ctx.session.user.email)
      });
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
});
