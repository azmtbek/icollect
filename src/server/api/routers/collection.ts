import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { collections, topics } from "@/server/db/schema";

export const collectionRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.collections.findMany();
    }),
  create: publicProcedure.input(z.object({
    name: z.string(),
    description: z.string(),
    topicId: z.number(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(collections).values({
      name: input.name,
      description: input.description,
      topicId: input.topicId,
    });
  })
});
