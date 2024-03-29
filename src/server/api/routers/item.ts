import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { itemTags, items, tags } from "@/server/db/schema";
import { type SQL, eq, inArray, sql, desc } from "drizzle-orm";
import { createItemSchema } from "@/lib/types/item";
import { increment } from "@/server/db";

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
    .input(z.object({ itemId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.items.findFirst({ where: eq(items.id, +input.itemId) });
    }),
  create: protectedProcedure
    .input(createItemSchema)
    .mutation(async ({ ctx, input }) => {
      const { newTags, tags: inputTags, ...rest } = input;
      // item insert
      const item = await ctx.db.insert(items).values(rest).returning({ id: items.id });
      const itemId = item?.[0]?.id;

      // create new tags
      let createdTags: { id: number; }[] = [];
      if (newTags)
        createdTags = await ctx.db
          .insert(tags)
          .values(newTags.map((tag) => ({ name: tag })))
          .onConflictDoUpdate({ target: tags.id, set: { count: increment(tags.count) } })
          .returning({ id: tags.id });

      const allTagIds = [...(inputTags ? inputTags.map(t => +t) : []), ...createdTags.map(t => t.id)];

      // create case for single update query
      const sqlChunks: SQL[] = [];
      sqlChunks.push(sql`(case`);
      for (const tagId of allTagIds) {
        sqlChunks.push(sql`when ${tags.id} = ${tagId} then ${increment(tags.count)}`);
      }
      sqlChunks.push(sql`end)`);
      const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

      // update tags count  and insert itemTags
      if (allTagIds.length > 0 && itemId) {
        await ctx.db.update(tags).set({ count: finalSql }).where(inArray(tags.id, allTagIds));
        await ctx.db.insert(itemTags).values(allTagIds.map(tag => ({ itemId: itemId, tagId: tag })));
      }
      return item;
    }),

});
