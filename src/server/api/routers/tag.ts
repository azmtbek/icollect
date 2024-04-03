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
  getItemsByTagId: publicProcedure
    .input(z.object({
      tagName: z.string()
    }))
    .query(({ ctx, input }) => {
      return ctx.db.select({
        id: items.id,
        name: items.name,
        collectionId: items.collectionId,
        customString1: items.customString1,
        customString2: items.customString1,
        customString3: items.customString1,
        customInteger1: items.customInteger1,
        customInteger2: items.customInteger2,
        customInteger3: items.customInteger3,
        customText1: items.customText1,
        customText2: items.customText2,
        customText3: items.customText3,
        customDate1: items.customDate1,
        customDate2: items.customDate2,
        customDate3: items.customDate3,
        customBoolean1: items.customBoolean1,
        customBoolean2: items.customBoolean2,
        customBoolean3: items.customBoolean3,
      })
        .from(itemTags)
        .leftJoin(tags, eq(itemTags.tagId, tags.id))
        .leftJoin(items, eq(itemTags.itemId, items.id))
        .where(eq(tags.name, input.tagName));
    }),
  getAllItemTags: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.itemTags.findMany();
    }),
  getMultipleByItemId: publicProcedure
    .input(z.object({
      itemIds: z.array(z.number())
    }))
    .query(({ ctx, input }) => {
      const x = input.itemIds.map(async (itemId) =>
        await ctx.db.select({
          itemId: items.id,
          tags: tags.name
        })
          .from(itemTags)
          .leftJoin(tags, eq(itemTags.tagId, tags.id))
          .leftJoin(items, eq(itemTags.itemId, items.id))
          .where(eq(items.id, itemId))
      );
      return x;
    }),
  getItemTagsAll: publicProcedure
    .query(async ({ ctx }) => {
      const itemTag = await ctx.db.query.itemTags.findMany();
      return itemTag;
    }),
  getItemTagNames: publicProcedure
    .input(z.object({
      itemId: z.number().optional()
    }))
    .query(({ ctx, input }) => {
      if (!input.itemId) return [];
      return ctx.db.select({
        id: tags.id
      })
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
