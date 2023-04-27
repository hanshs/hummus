import { z } from 'zod';
import { protectedProcedure } from '../procedure';
import { trpc } from '../trpc';

export const behavioursRouter = trpc.router({
  default: protectedProcedure.query(({ ctx }) => {
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
        subSteps: {
          include: {
            behaviour: true,
            params: true,
          },
        },
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z.string(),
        steps: z.array(z.object({ behaviourId: z.string(), paramIds: z.array(z.number()) })).optional(),
        projectId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.behaviour.create({
        data: {
          value: input.value,
          subSteps: input.steps
            ? {
                create: input.steps.map(({ behaviourId, paramIds }, index) => ({
                  order: index + 1,
                  behaviour: { connect: { id: behaviourId } },
                  params: { connect: paramIds.map((id) => ({ id })) },
                })),
              }
            : undefined,
          project: { connect: { id: input.projectId } },
        },
      });
    }),
});
