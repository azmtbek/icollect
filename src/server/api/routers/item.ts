import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { items } from "@/server/db/schema";

export const itemRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.items.findMany();
    }),
  create: publicProcedure.input(z.object({
    name: z.string(),
    collectionId: z.number(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(items).values({
      name: input.name,
      collectionId: input.collectionId,
    });
  })
});
