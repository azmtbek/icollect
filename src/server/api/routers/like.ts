import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { items, likes } from "@/server/db/schema";
import { and, eq, } from "drizzle-orm";
import { decrement, increment } from "@/server/db";

export const likeRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({
    itemId: z.number()
  }))
    .query(async ({ ctx, input }) => {
      const row = await ctx.db.query.likes.findFirst({
        where: and(
          eq(likes.itemId, input.itemId),
          eq(likes.userId, ctx.session.user.id)
        )
      });
      return row ? true : false;
    }),
  toggle: protectedProcedure.input(z.object({
    itemId: z.coerce.number().min(1),
  })).mutation(async ({ ctx, input }) => {
    const userLiked = await ctx.db.query.likes
      .findFirst({
        where: and(
          eq(likes.itemId, input.itemId),
          eq(likes.userId, ctx.session.user.id)
        )
      });
    // if liked delete
    if (userLiked)
      await ctx.db.transaction(async (tx) => {
        await tx.delete(likes).where(and(
          eq(likes.itemId, input.itemId),
          eq(likes.userId, ctx.session.user.id)
        ));
        await tx.update(items).set({ likesCount: decrement(items.likesCount) });
      });
    //else insert
    else
      await ctx.db.transaction(async (tx) => {
        await tx.insert(likes).values({ itemId: +input.itemId, userId: ctx.session.user.id });
        await tx.update(items).set({ likesCount: increment(items.likesCount) });
      });
  })
});
