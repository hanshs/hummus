import { getServerSession } from "@hummus/auth";
import { prisma } from "@hummus/db";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

/**
 * context used in router, used to process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    const session = await getServerSession(opts.req, opts.res)

    return {
        session,
        prisma
    };
};