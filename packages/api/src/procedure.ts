import { enforceUserIsAuthed } from "./middleware";
import { trpc } from "./trpc";


/**
 * Protected (authed) procedure
 * verifies the session is valid and guarantees ctx.session.user is not null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = trpc.procedure.use(enforceUserIsAuthed);
/**
 * Public (unauthed) procedure
 */
export const publicProcedure = trpc.procedure;