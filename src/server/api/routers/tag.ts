import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { itemTags, items, tags } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const tagRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.tags.findMany();
    }),
  getAllItemTags: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.itemTags.findMany();
    }),
  getMultipleByItemId: publicProcedure
    .input(z.object({
      itemIds: z.array(z.number())
    })).query(({ ctx, input }) => {
      const x = input.itemIds.map(async (itemId) =>
        await ctx.db.select(
          {
            itemId: items.id,
            tags: tags.name
          }
        )
          .from(itemTags)
          .leftJoin(tags, eq(itemTags.tagId, tags.id))
          .leftJoin(items, eq(itemTags.itemId, items.id))
          .where(eq(items.id, itemId))
      );
      return x;
    }),
  getItemTags: publicProcedure
    .input(z.object({
      itemId: z.number()
    }))
    .query(async ({ ctx, input }) => {
      const itemTag = await ctx.db.query.itemTags.findMany({ where: eq(itemTags.itemId, input.itemId) });
    }),
  getItemTagNames: publicProcedure
    .input(z.object({
      itemId: z.number().optional()
    }))
    .query(({ ctx, input }) => {
      if (!input.itemId) return [];
      return ctx.db.select(
        // {
        //   // itemId: items.id,
        //   tags: tags.name
        // }
      )
        .from(itemTags)
        .leftJoin(tags, eq(itemTags.tagId, tags.id))
        .leftJoin(items, eq(itemTags.itemId, items.id))
        .where(eq(items.id, input.itemId));
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
