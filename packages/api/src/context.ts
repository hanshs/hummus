import { prisma } from '@hummus/db';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './session';

/**
 * context used in router, used to process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createContext = async (opts: CreateNextContextOptions | CreateHTTPContextOptions) => {
  const token = opts.req.headers.authorization;

  if (token) {
    const user = await prisma.user.findFirst({ where: { accessToken: token } });

    if (user) {
      return {
        session: { isLoggedIn: true, username: user.username, userId: user.id, token },
        prisma,
      };
    }
  }

  const session = await getIronSession(opts.req, opts.res, sessionOptions);

  return {
    session,
    prisma,
  };
};
