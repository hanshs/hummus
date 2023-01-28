import { getServerSession } from "@hummus/auth";
import { prisma } from "@hummus/db";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

/**
 * context used in router, used to process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createContext = async (opts: CreateNextContextOptions | CreateHTTPContextOptions) => {
    const token = opts.req.headers.authorization

    if (token) {
        const user = await prisma.user.findFirst({ where: { accessToken: token } })
        if (user) {
            return {
                session: { isLoggedIn: true, username: user.username, userId: user.id, token },
                prisma
            }
        }
    }

    const session = await getServerSession(opts.req, opts.res)
<<<<<<< Updated upstream

=======
    console.log('jou headersid on createContextis:', opts.req.headers.authorization)
>>>>>>> Stashed changes
    return {
        session,
        prisma
    };
};