import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { collections } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const defaultCustomFieldSchema = z.object({
  state: z.boolean().optional(), name: z.string().optional()
}).optional();

export const collectionRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.db.query.collections.findMany();
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.collections.findFirst({ where: eq(collections.id, input.id) });
    }),
  getUserCollections: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.query.collections.findMany({ where: eq(collections.createdById, ctx.session.user.id) });
    }),
  create: protectedProcedure.input(z.object({
    name: z.string(),
    description: z.string().optional(),
    topicId: z.number(),
    customString1: defaultCustomFieldSchema,
    customString2: defaultCustomFieldSchema,
    customString3: defaultCustomFieldSchema,
    customInteger1: defaultCustomFieldSchema,
    customInteger2: defaultCustomFieldSchema,
    customInteger3: defaultCustomFieldSchema,
    customText1: defaultCustomFieldSchema,
    customText2: defaultCustomFieldSchema,
    customText3: defaultCustomFieldSchema,
    customDate1: defaultCustomFieldSchema,
    customDate2: defaultCustomFieldSchema,
    customDate3: defaultCustomFieldSchema,
    customBoolean1: defaultCustomFieldSchema,
    customBoolean2: defaultCustomFieldSchema,
    customBoolean3: defaultCustomFieldSchema,
  })).mutation(async ({ ctx, input }) => {
    return ctx.db.insert(collections).values({
      name: input.name,
      description: input.description,
      topicId: input.topicId,
      createdById: ctx.session?.user.id,
      // custom strings
      ...(input.customString1?.state && {
        custom_string1_state: input.customString1.state,
        custom_string1_name: input.customString1.name
      }),
      ...(input.customString2?.state && {
        custom_string2_state: input.customString2.state,
        custom_string2_name: input.customString2.name
      }),
      ...(input.customString3?.state && {
        custom_string3_state: input.customString3.state,
        custom_string3_name: input.customString3.name
      }),
      // custom integers
      ...(input.customInteger1?.state && {
        custom_integer1_state: input.customInteger1.state,
        custom_integer1_name: input.customInteger1.name
      }),
      ...(input.customInteger2?.state && {
        custom_integer2_state: input.customInteger2.state,
        custom_integer2_name: input.customInteger2.name
      }),
      ...(input.customInteger3?.state && {
        custom_integer3_state: input.customInteger3.state,
        custom_integer3_name: input.customInteger3.name
      }),
      // custom booleans
      ...(input.customBoolean1?.state && {
        custom_boolean1_state: input.customBoolean1.state,
        custom_boolean1_name: input.customBoolean1.name
      }),
      ...(input.customBoolean2?.state && {
        custom_boolean2_state: input.customBoolean2.state,
        custom_boolean2_name: input.customBoolean2.name
      }),
      ...(input.customBoolean3?.state && {
        custom_boolean3_state: input.customBoolean3.state,
        custom_boolean3_name: input.customBoolean3.name
      }),
      // custom texts
      ...(input.customText1?.state && {
        custom_text1_state: input.customText1.state,
        custom_text1_name: input.customText1.name
      }),
      ...(input.customText2?.state && {
        custom_text2_state: input.customText2.state,
        custom_text2_name: input.customText2.name
      }),
      ...(input.customText3?.state && {
        custom_text3_state: input.customText3.state,
        custom_text3_name: input.customText3.name
      }),
      // custom dates
      ...(input.customDate1?.state && {
        custom_date1_state: input.customDate1.state,
        custom_date1_name: input.customDate1.name
      }),
      ...(input.customDate2?.state && {
        custom_date2_state: input.customDate2.state,
        custom_date2_name: input.customDate2.name
      }),
      ...(input.customDate3?.state && {
        custom_date3_state: input.customDate3.state,
        custom_date3_name: input.customDate3.name
      }),
    }).returning({ id: collections.id });
  })
});
