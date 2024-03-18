import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { topics } from "@/server/db/schema";

export const adminRouter = createTRPCRouter({
  getTopics: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.topics.findMany();
    }),
  createTopic: publicProcedure.input(z.object({
    name: z.string()
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(topics).values({ name: input.name });
  })
});
