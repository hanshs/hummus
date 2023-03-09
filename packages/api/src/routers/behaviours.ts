import { z } from 'zod';
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
  create: protectedProcedure
    .input(z.object({ value: z.string(), projectId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.behaviour.create({
        data: {
          value: input.value,
          project: { connect: { id: input.projectId } },
        },
      });
    }),
});
