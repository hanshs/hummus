import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { router } from './router';
import { createContext } from './context';
const port = 4000;
createHTTPServer({ router, createContext }).listen(port);
