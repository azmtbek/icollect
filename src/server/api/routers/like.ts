import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { items, likes } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const likeRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.tags.findMany();
    }),
  toggle: publicProcedure.input(z.object({
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
        await tx.delete(likes).where(and(eq(likes.itemId, +input.itemId), eq(likes.userId, input.userId)));
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
