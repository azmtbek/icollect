import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { tags } from "@/server/db/schema";

export const tagRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.tags.findMany();
    }),
  create: publicProcedure.input(z.object({
    name: z.string().max(100).toLowerCase(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(tags).values({
      name: input.name,
    });
  }),
});
