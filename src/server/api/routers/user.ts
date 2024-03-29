import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { nanoid } from 'nanoid';
import { updateMany } from "@/server/db";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.query.users.findMany({ where: eq(users.isDeleted, false) });
      return user;
    }),
  blockUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db
        .update(users)
        .set({ status: "blocked" })
        .where(eq(users.id, input.userId));
      return user;
    }),
  blockManyUsers: adminProcedure
    .input(z.object({ userIds: z.string().array() }))
    .query(async ({ ctx, input }) => {
      const updateCase = updateMany(input.userIds, users, users.status, sql`"blocked"`);
      await ctx.db.update(users)
        .set({ status: updateCase })
        .where(inArray(users.id, input.userIds));
    }),
  unblockUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db
        .update(users)
        .set({ status: "active" })
        .where(eq(users.id, input.userId));
      return user;
    }),
  unblockManyUsers: adminProcedure
    .input(z.object({ userIds: z.string().array() }))
    .query(async ({ ctx, input }) => {
      const updateCase = updateMany(input.userIds, users, users.status, sql`"active"`);
      await ctx.db.update(users)
        .set({ status: updateCase })
        .where(inArray(users.id, input.userIds));
    }),
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db
        .update(users)
        .set({ isDeleted: true })
        .where(eq(users.id, input.userId));
      return user;
    }),

  deleteManyUsers: adminProcedure
    .input(z.object({ userIds: z.string().array() }))
    .query(async ({ ctx, input }) => {
      const updateCase = updateMany(input.userIds, users, users.isDeleted, sql`${true}`);
      await ctx.db.update(users)
        .set({ isDeleted: updateCase })
        .where(inArray(users.id, input.userIds));
    }),
  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.users.findFirst({
        where: and(
          eq(users.email, input.email),
          eq(users.isDeleted, false)
        )
      });
    }),
  getCurrentFull: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.session || !ctx.session.user || !ctx.session.user.id) return;
      return ctx.db.query.users.findFirst({
        where: and(
          eq(users.id, ctx.session.user.id),
          eq(users.isDeleted, false)
        )
      });
    }),
  getCurrent: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.session || !ctx.session.user || !ctx.session.user.email) return;
      return ctx.db.query.users.findFirst({
        columns: {
          id: true,
          email: true,
          isAdmin: true,
          name: true,
          image: true,
          status: true,
        },
        where: and(
          eq(users.email, ctx.session.user.email),
          eq(users.isDeleted, false)
        )
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
