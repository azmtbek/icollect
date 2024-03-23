import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { itemTags, tags } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const tagRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.tags.findMany();
    }),
  getItemTags: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.itemTags.findMany();
    }),
  deleteItemTag: adminProcedure.input(z.object({
    itemId: z.number(),
    tagId: z.number()
  }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(itemTags).where(and(
        eq(itemTags.itemId, input.itemId),
        eq(itemTags.tagId, input.tagId))
      );
    }),
  create: protectedProcedure.input(z.object({
    name: z.string().max(100).toLowerCase(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(tags).values({
      name: input.name,
    });
  }),
});
