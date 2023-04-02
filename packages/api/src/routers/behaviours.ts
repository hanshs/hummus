import { z } from 'zod';
import { protectedProcedure } from '../procedure';
import { trpc } from '../trpc';

export const behavioursRouter = trpc.router({
  browser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.behaviour.findMany({
      where: {
        projectId: null,
      },
      select: {
        id: true,
        value: true,
      },
    });
  }),
  byProjectId: protectedProcedure.input(z.object({ projectId: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.behaviour.findMany({
      where: {
        projectId: input.projectId,
      },
      select: {
        id: true,
        value: true,
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({ value: z.string(), steps: z.array(z.object({ id: z.number() })).optional(), projectId: z.string() }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.behaviour.create({
        data: {
          value: input.value,
          scenarioSteps: {
            connect: input.steps,
          },
          project: { connect: { id: input.projectId } },
        },
      });
    }),
});
