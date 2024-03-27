import { z } from "zod";

import {
  publicProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import { topics } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const topicRouter = createTRPCRouter({
  getTopicById: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .query(async ({ ctx, input }) => {
      const x = await ctx.db.query.topics.findFirst({ where: eq(topics.id, input.id) });
      return x;
    }),
});
