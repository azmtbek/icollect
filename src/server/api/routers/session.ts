// import { z } from "zod";

// import {
//   createTRPCRouter,
//   protectedProcedure,
// } from "@/server/api/trpc";
// import { tags, users } from "@/server/db/schema";
// import { eq } from "drizzle-orm";
// import { TRPCError } from "@trpc/server";

// export const sessionRouter = createTRPCRouter({
//   get: protectedProcedure
//     .query(async ({ ctx }) => {
//       if (!ctx.session.user || !ctx.session.user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
//       return ctx.db.query.users.findFirst({ where: eq(users.email, ctx.session.user.email) });
//     }),
// });
