
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { router } from './router';
import { createContext } from './context';

createHTTPServer({ router, createContext, }).listen(4000);
