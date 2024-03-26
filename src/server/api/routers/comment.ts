import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { comments, items } from "@/server/db/schema";
import { asc, eq, sql } from "drizzle-orm";

export const commentRouter = createTRPCRouter({
  getAllByItemId: publicProcedure
    .input(z.object({
      itemId: z.string().min(1)
    }))
    .query(({ ctx, input }) => {
      return ctx.db.query.comments.findMany({
        where: eq(comments.itemId, +input.itemId),
        orderBy: [asc(comments.createdAt)],
      });
    }),
  create: publicProcedure
    .input(z.object({
      text: z.string(),
      itemId: z.string().min(1),
      createdById: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.insert(comments).values({
          text: input.text,
          itemId: +input.itemId,
          createdById: input.createdById,
        }),
          await tx.update(items)
            .set({ commentsCount: sql`${items.commentsCount} + 1` })
            .where(eq(items.id, +input.itemId));
      });
    }),
});
