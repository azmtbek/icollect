import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { collections, itemTags, items, tags } from "@/server/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { createItemSchema, itemSchema } from "@/lib/types/item";
import { increment, updateMany } from "@/server/db";

export const itemRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.items.findMany();
    }),
  getLatest: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.items.findMany({ orderBy: desc(items.createdAt), limit: 10 });
    }),
  getCollectionItems: publicProcedure
    .input(z.object({ collectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const reItems = await ctx.db.select()
        .from(items)
        .where(eq(items.collectionId, input.collectionId));
      return reItems;
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.items.findFirst({ where: eq(items.id, +input.id) });
    }),
  create: protectedProcedure
    .input(createItemSchema)
    .mutation(async ({ ctx, input }) => {
      const { newTags, tags: inputTags, ...rest } = input;
      // item insert
      const item = await ctx.db.insert(items).values(rest).returning({ id: items.id });
      const itemId = item?.[0]?.id;

      // update collections count
      await ctx.db.update(collections).set({
        itemCount: increment(collections.itemCount)
      }).where(eq(collections.id, input.collectionId));

      // create new tags
      let createdTags: { id: number; }[] = [];
      if (newTags && newTags?.length > 0)
        createdTags = await ctx.db
          .insert(tags)
          .values(newTags.map((tag) => ({ name: tag })))
          .onConflictDoUpdate({ target: tags.id, set: { count: increment(tags.count) } })
          .returning({ id: tags.id });

      const allTagIds = [...(inputTags ? inputTags.map(t => +t) : []), ...createdTags.map(t => t.id)];

      // create case for single update query
      const updateCase = updateMany(allTagIds, tags.id, increment(tags.count));

      // update tags count  and insert itemTags
      if (allTagIds.length > 0 && itemId) {
        await ctx.db.update(tags).set({ count: updateCase }).where(inArray(tags.id, allTagIds));
        await ctx.db.insert(itemTags).values(allTagIds.map(tag => ({ itemId: itemId, tagId: tag })));
      }
      return item;
    }),
  update: protectedProcedure.
    input(itemSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update(items).set({ ...input }).where(eq(items.id, input.id)).returning({ id: items.id });
    }),
  delete: protectedProcedure.
    input(itemSchema.pick({ id: true, }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update(items).set({ isDeleted: true }).where(eq(items.id, input.id));;
    }),
});
