import { z } from "zod";

import {
  publicProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import { items } from "@/server/db/schema";
import { sql } from "drizzle-orm";

export const searchRouter = createTRPCRouter({
  getResults: publicProcedure
    .input(z.object({
      search: z.string().max(20)
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.select()
        .from(items)
        .where(
          sql`${items.name} ILIKE ${'%' + input.search + '%'} `
          // sql`to_tsvector('simple', ${items.name}) %% to_tsquery('simple', '${input.search}')`
        );
    }),
  // getResultsFTS: publicProcedure
  //   .input(z.object({
  //     search: z.string().max(20)
  //   }))
  //   .query(async ({ ctx, input }) => {
  //     return ctx.db.select()
  //       .from(items)
  //       .where(
  //         // sql`${items.name} ILIKE ${'%' + input.search + '%'} `
  //         sql` ${items.fts} %% to_tsquery('simple', '${input.search}')`
  //       );
  //   }),
});
