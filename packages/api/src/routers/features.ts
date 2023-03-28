import { z } from 'zod';
import { protectedProcedure } from '../procedure';
import { trpc } from '../trpc';

export const featureRouter = trpc.router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.feature.findMany({ where: {} });
  }),
  // byParamId: protectedProcedure.input(z.object({paramId: z.number()})).query()
  create: protectedProcedure.input(z.object({ projectId: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.feature.create({
      data: {
        project: {
          connect: {
            id: input.projectId,
          },
        },
      },
    });
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.feature.delete({
      where: {
        id: input.id,
      },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        }),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.feature.update({
        data: input.data,
        where: {
          id: input.id,
        },
      });
    }),
});
