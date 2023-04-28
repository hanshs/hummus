import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { router } from './src/router';

export { sessionOptions } from './src/session';
export { createContext } from './src/context';
export { nextApiHandler } from './src/handler';
export { router };
export type Router = typeof router;
export type RouterOutputs = inferRouterOutputs<Router>;
export type RouterInputs = inferRouterInputs<Router>;
