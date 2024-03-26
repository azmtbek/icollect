import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { collections } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { collectionSchema } from "@/lib/types";

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
    .query(async ({ ctx, input }) => {
      const collection = await ctx.db.query.collections.findFirst({ where: eq(collections.id, input.id) });
      if (!collection || collection.isDeleted)
        throw new TRPCError({ code: "NOT_FOUND" });

      return ({
        id: collection.id,
        image: collection.image,
        name: collection.name,
        description: collection.description,
        topicId: collection.topicId,
        createdById: collection.createdById,

        ...(collection.custom_string1_state && {
          customString1State: collection.custom_string1_state,
          customString1Name: collection.custom_string1_name,
        }),
        ...(collection.custom_string2_state && {
          customString2State: collection.custom_string2_state,
          customString2Name: collection.custom_string2_name,
        }),
        ...(collection.custom_string3_state && {
          customString3State: collection.custom_string3_state,
          customString3Name: collection.custom_string3_name,
        }),

        ...(collection.custom_integer1_state && {
          customInteger1State: collection.custom_integer1_state,
          customInteger1Name: collection.custom_integer1_name,
        }),
        ...(collection.custom_integer2_state && {
          customInteger2State: collection.custom_integer2_state,
          customInteger2Name: collection.custom_integer2_name,
        }),
        ...(collection.custom_integer3_state && {
          customInteger3State: collection.custom_integer3_state,
          customInteger3Name: collection.custom_integer3_name,
        }),

        ...(collection.custom_text1_state && {
          customText1State: collection.custom_text1_state,
          customText1Name: collection.custom_text1_name,
        }),
        ...(collection.custom_text2_state && {
          customText2State: collection.custom_text2_state,
          customText2Name: collection.custom_text2_name,
        }),
        ...(collection.custom_text3_state && {
          customText3State: collection.custom_text3_state,
          customText3Name: collection.custom_text3_name,
        }),

        ...(collection.custom_boolean1_state && {
          customBoolean1State: collection.custom_boolean1_state,
          customBoolean1Name: collection.custom_boolean1_name,
        }),
        ...(collection.custom_boolean2_state && {
          customBoolean2State: collection.custom_boolean2_state,
          customBoolean2Name: collection.custom_boolean2_name,
        }),
        ...(collection.custom_boolean3_state && {
          customBoolean3State: collection.custom_boolean3_state,
          customBoolean3Name: collection.custom_boolean3_name,
        }),

        ...(collection.custom_date1_state && {
          customDate1State: collection.custom_date1_state,
          customDate1Name: collection.custom_date1_name,
        }),
        ...(collection.custom_date2_state && {
          customDate2State: collection.custom_date2_state,
          customDate2Name: collection.custom_date2_name,
        }),
        ...(collection.custom_date3_state && {
          customDate3State: collection.custom_date3_state,
          customDate3Name: collection.custom_date3_name,
        }),
      });
    }),
  getUserCollections: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.query.collections.findMany({ where: eq(collections.createdById, ctx.session.user.id) });
    }),
  create: protectedProcedure.input(collectionSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
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
