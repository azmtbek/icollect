import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { itemTags, items, tags } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { itemSchema } from "@/lib/types/item";

export const itemRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.items.findMany();
    }),
  getCollectionItems: publicProcedure
    .input(z.object({ collectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const reItems = await ctx.db.select()
        .from(items)
        // .leftJoin(items, eq(itemTags.itemId, items.id))
        // .leftJoin(tags, eq(itemTags.tagId, tags.id))
        .where(eq(items.collectionId, input.collectionId));
      // const reItems = await ctx.db.query.items.findMany({
      //   where: eq(items.collectionId, input.collectionId)
      // });
      return reItems;
    }),
  getById: publicProcedure
    .input(z.object({ itemId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.items.findFirst({ where: eq(items.id, +input.itemId) });
    }),
  create: publicProcedure
    .input(itemSchema.omit({ id: true }).extend({ newTags: z.array(z.string()), collectionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.insert(items).values(input).returning({ id: items.id });

      let createdTags: { id: number; }[] = [];
      if (input.newTags.length > 0)
        createdTags = await ctx.db.insert(tags).values(
          input.newTags.map((tag) => ({ name: tag }))
        ).returning({ id: tags.id });

      const allTags = [...(input?.tags as []), ...createdTags.map(t => t.id)];

      if (allTags.length > 0) {
        await ctx.db.insert(itemTags).values(allTags.map(tag => ({ itemId: item[0]!.id, tagId: tag })));
      }
      return item;
    }),

});
