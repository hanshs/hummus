import { TRPCError } from "@trpc/server";
import { trpc } from "./trpc";

/**
 * enforces users are logged in before running the procedure
 */
export const enforceUserIsAuthed = trpc.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.isLoggedIn) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
        ctx: {
            session: ctx.session
        },
    });
});