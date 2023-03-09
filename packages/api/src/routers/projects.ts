import { z } from 'zod';
import { protectedProcedure } from '../procedure';
import { trpc } from '../trpc';

export const projectsRouter = trpc.router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: {
        users: { some: { id: ctx.session.userId } },
      },
    });
  }),
  create: protectedProcedure.input(z.object({ name: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.project.create({
      data: {
        name: input.name,
        users: {
          connect: {
            id: ctx.session.userId,
          },
        },
      },
    });
  }),
  byId: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.project.findFirst({
      where: {
        id: input,
        users: {
          some: {
            id: ctx.session.userId,
          },
        },
      },
      include: {
        features: {
          include: {
            scenarios: {
              include: {
                steps: {
                  include: {
                    behaviour: true,
                    params: true,
                  },
                },
              },
            },
            params: {
              include: {
                steps: true,
              },
            },
          },
        },
      },
    });
  }),
});
