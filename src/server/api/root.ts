import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { adminRouter } from "./routers/admin";
import { collectionRouter } from "./routers/collection";
import { itemRouter } from "./routers/item";
import { tagRouter } from "./routers/tag";
import { commentRouter } from "./routers/comment";
import { likeRouter } from "./routers/like";
import { topicRouter } from "./routers/topic";
import { searchRouter } from "./routers/search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  admin: adminRouter,
  collection: collectionRouter,
  item: itemRouter,
  tag: tagRouter,
  comment: commentRouter,
  like: likeRouter,
  topic: topicRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
