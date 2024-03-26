import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import { tags, topics } from "@/server/db/schema";

export const adminRouter = createTRPCRouter({
  getTopics: adminProcedure
    .query(async ({ ctx }) => {
      const x = await ctx.db.query.topics.findMany();
      return x;
    }),
  createTopic: adminProcedure.input(z.object({
    name: z.string()
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(topics).values({ name: input.name });
  }),
  createTag: adminProcedure.input(z.object({
    name: z.string()
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(tags).values({ name: input.name });
  })
});
