import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { collections } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { collectionSchema } from "@/lib/types/collection";


export const collectionRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.collections.findMany({
        where: eq(collections.isDeleted, false)
      });
    }),
  getBiggestFive: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.collections.findMany({
        where: eq(collections.isDeleted, false),
        orderBy: desc(collections.itemCount),
        limit: 5,
      });
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const collection = await ctx.db.query.collections.findFirst({
        where: and(
          eq(collections.id, input.id),
          eq(collections.isDeleted, false),
        )
      });
      if (!collection || collection.isDeleted)
        throw new TRPCError({ code: "NOT_FOUND" });

      // eslint-disable-next-line  @typescript-eslint/no-unused-vars
      const { isDeleted, ...rest } = collection;
      return rest;
    }),
  getUserCollections: protectedProcedure
    .input(z.object({ userId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      if (input && ctx.session.user.isAdmin)
        return ctx.db.query.collections.findMany({
          where: and(
            eq(collections.createdById, input.userId),
            eq(collections.isDeleted, false),
          )
        });
      return ctx.db.query.collections.findMany({
        where: and(
          eq(collections.createdById, ctx.session.user.id),
          eq(collections.isDeleted, false),
        )
      });
    }),
  create: protectedProcedure.
    input(collectionSchema.omit({ id: true }).extend({ createdById: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(collections).values({
        createdById: (input.createdById && ctx.session.user.isAdmin) ? input.createdById : ctx.session.user.id,
        ...input
      }).returning({ id: collections.id });
    }),
  update: protectedProcedure.
    input(collectionSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(collections).set({ ...input })
        .where(eq(collections.id, input.id)).returning({ id: collections.id });;
    }),
  delete: protectedProcedure.
    input(collectionSchema.pick({ id: true, }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update(collections).set({ isDeleted: true }).where(eq(collections.id, input.id));;
    }),
  updateImageUrl: publicProcedure
    .input(z.object({ imageUrl: z.string(), collectionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.update(collections).set({
        image: input.imageUrl
      }).where(eq(collections.id, input.collectionId));

    })
});
