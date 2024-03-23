import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { items, likes, users } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const likeRouter = createTRPCRouter({
  get: publicProcedure.input(z.object({
    itemId: z.string().min(1),
    userId: z.string().min(1),
  }))
    .query(async ({ ctx, input }) => {
      const row = await ctx.db.query.likes.findFirst({
        where: and(
          eq(likes.itemId, +input.itemId),
          eq(likes.userId, input.userId)
        )
      });
      return row ? true : false;
    }),
  // getByUserEmail: publicProcedure.input(z.object({
  //   itemId: z.string().min(1),
  //   UserEmailId: z.string().min(1),
  // }))
  //   .query(async ({ ctx, input }) => {
  //     const row = await ctx.db.select(users.id).from(users).where(eq(ctx.session?.user?.email, users.email)).on()..findFirst({
  //       where: and(
  //         eq(likes.itemId, +input.itemId),
  //         eq(likes.userId, input.UserEmail)
  //       )
  //     });
  //     return row ? true : false;
  //   }),
  toggle: protectedProcedure.input(z.object({
    itemId: z.string().min(1),
    userId: z.string().min(1),
  })).mutation(async ({ ctx, input }) => {
    const userLiked = await ctx.db.query.likes
      .findFirst({
        where: and(
          eq(likes.itemId, +input.itemId),
          eq(likes.userId, input.userId)
        )
      });
    // if liked delete
    if (userLiked)
      await ctx.db.transaction(async (tx) => {
        await tx.delete(likes).where(and(
          eq(likes.itemId, +input.itemId),
          eq(likes.userId, input.userId))
        );
        await tx.update(items).set({ likesCount: sql`${items.likesCount} - 1` });
      });
    //else insert
    else
      await ctx.db.transaction(async (tx) => {
        await tx.insert(likes).values({ itemId: +input.itemId, userId: input.userId });
        await tx.update(items).set({ likesCount: sql`${items.likesCount} + 1` });
      });
  })
});
