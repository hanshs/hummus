import { protectedProcedure } from '../procedure';
import { trpc } from '../trpc';

export const behavioursRouter = trpc.router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.behaviour.findMany({
      select: {
        id: true,
        value: true,
      },
    });
  }),
});
