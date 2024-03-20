import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { adminRouter } from "./routers/admin";
import { collectionRouter } from "./routers/collection";
import { itemRouter } from "./routers/item";
import { tagRouter } from "./routers/tag";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  admin: adminRouter,
  collection: collectionRouter,
  item: itemRouter,
  tag: tagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
