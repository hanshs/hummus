import { z } from 'zod';
import { protectedProcedure } from '../procedure';
import { trpc } from '../trpc';

export const stepsRouter = trpc.router({
  update: protectedProcedure
    .input(z.object({ stepId: z.number(), params: z.object({ oldId: z.number().optional(), newId: z.number() }) }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.step.update({
        where: {
          id: input.stepId,
        },
        data: {
          params: {
            connect: {
              id: input.params.newId,
            },
            ...(input.params.oldId
              ? {
                  disconnect: {
                    id: input.params.oldId,
                  },
                }
              : {}),
          },
        },
      });
    }),
});
