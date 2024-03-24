import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { collections, topics, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const collectionRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.collections.findMany();
    }),
  getUserCollections: protectedProcedure
    .query(async ({ ctx }) => {
      // const userId = await ctx.db.select({ id: users.id }).from(users).where(eq(users.email, ctx.session?.user.email));
      return ctx.db.query.collections.findMany({ where: eq(collections.createdById, ctx.session.user.id) });
    }),
  create: protectedProcedure.input(z.object({
    name: z.string(),
    description: z.string().optional(),
    topicId: z.number(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(collections).values({
      name: input.name,
      description: input.description,
      topicId: input.topicId,
      createdById: ctx.session?.user.id
    });
  })
});
