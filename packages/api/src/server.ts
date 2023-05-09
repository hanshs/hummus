import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { router } from './router';
import { createContext } from './context';

const port = 4000;
// standalone server is not needed, when manager api routes can be used for connecting via Runner
// if standalone server needed then add script eg. "dev": "tsx watch ./src/server" into package.json
createHTTPServer({ router, createContext }).listen(port);
