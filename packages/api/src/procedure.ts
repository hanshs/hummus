import { TRPCError } from '@trpc/server';
import { enforceAuth } from './middleware';
import { trpc } from './trpc';

/**
 * Protected (authed) procedure
 * verifies the session is valid and guarantees ctx.session.user is not null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = trpc.procedure.use(enforceAuth);
/**
 * Public (unauthed) procedure
 */
export const publicProcedure = trpc.procedure;
// .use(
//   trpc.middleware(({ ctx, next }) => {
//     try {
//       const res = next();
//       console.log(res);
//       return res;
//     } catch (e) {
//       throw new TRPCError({
//         code: 'INTERNAL_SERVER_ERROR',
//         message: 'Something went wrong.',
//       });
//     }
//   }),
// );
