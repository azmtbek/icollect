import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { collections } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { collectionSchema } from "@/lib/types/collection";


// const ;


export const collectionRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.collections.findMany();
    }),
  getBiggestFive: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.collections.findMany({ orderBy: desc(collections.itemCount), limit: 5 });
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const collection = await ctx.db.query.collections.findFirst({ where: eq(collections.id, input.id) });
      if (!collection || collection.isDeleted)
        throw new TRPCError({ code: "NOT_FOUND" });

      // eslint-disable-next-line  @typescript-eslint/no-unused-vars
      const { isDeleted, ...rest } = collection;
      return rest;
    }),
  getUserCollections: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.query.collections.findMany({ where: eq(collections.createdById, ctx.session.user.id) });
    }),
  create: protectedProcedure.
    input(collectionSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(collections).values({
        createdById: ctx.session?.user.id,
        ...input
      }).returning({ id: collections.id });
    }),
  updateImageUrl: publicProcedure
    .input(z.object({ imageUrl: z.string(), collectionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update(collections).set({
        image: input.imageUrl
      }).where(eq(collections.id, input.collectionId));

    })
});
