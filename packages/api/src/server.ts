
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { router } from './router';
import { createContext } from './context';

const server = createHTTPServer({
  router,
  createContext,
});

server.listen(4000)