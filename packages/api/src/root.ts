import { createTRPCRouter } from "./trpc";
import { authRouter } from "./router/auth";

export const appRouter = createTRPCRouter({
  // post: postRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
