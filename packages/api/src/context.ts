import { getServerSession } from "@hummus/auth";
import { prisma } from "@hummus/db";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

/**
 * context used in router, used to process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createContext = async (opts: CreateNextContextOptions | CreateHTTPContextOptions) => {
    const session = await getServerSession(opts.req, opts.res)
    console.log(opts.req.headers.authorization)
    return {
        session,
        prisma
    };
};