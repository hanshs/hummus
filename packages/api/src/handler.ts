import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createContext } from './context';
import { router } from './router';

export const nextApiHandler = createNextApiHandler({
  router,
  createContext,
});
