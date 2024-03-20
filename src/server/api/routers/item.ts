import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { itemTags, items, tags } from "@/server/db/schema";

export const itemRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.items.findMany();
    }),
  create: publicProcedure.input(z.object({
    name: z.string(),
    collectionId: z.number(),
    tags: z.array(z.string().trim()),
    newTags: z.array(z.string().trim()),
  })).mutation(async ({ ctx, input }) => {
    const item = await ctx.db.insert(items).values({
      name: input.name,
      collectionId: input.collectionId,
    }).returning({ id: items.id });

    let createdTags: { id: number; }[] = [];
    if (input.newTags.length > 0)
      createdTags = await ctx.db.insert(tags).values(
        input.newTags.map((tag) => ({ name: tag }))
      ).returning({ id: tags.id });

    const allTags = [...input.tags.map(t => +t), ...createdTags.map(t => t.id)];

    if (item && item[0] && allTags.length > 0) {
      await ctx.db.insert(itemTags).values(allTags.map(tag => ({ itemId: item[0]!.id, tagId: tag })));
    }
  }),
});
