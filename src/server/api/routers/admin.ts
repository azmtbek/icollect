import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { tags, topics } from "@/server/db/schema";

export const adminRouter = createTRPCRouter({
  getTopics: adminProcedure
    .query(({ ctx }) => {
      return ctx.db.query.topics.findMany();
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
