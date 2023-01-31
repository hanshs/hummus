import { z } from 'zod';
import { protectedProcedure } from '../procedure';
import { trpc } from '../trpc';

export const scenariosRouter = trpc.router({
  create: protectedProcedure.input(z.object({ featureId: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.scenario.create({
      data: {
        feature: {
          connect: {
            id: input.featureId,
          },
        },
      },
    });
  }),
  update: protectedProcedure
    .input(z.object({ id: z.number(), data: z.object({ name: z.string() }) }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.scenario.update({
        data: input.data,
        where: {
          id: input.id,
        },
      });
    }),
  addStep: protectedProcedure
    .input(
      z.object({
        scenarioId: z.number(),
        data: z.object({
          behaviourId: z.number(),
          order: z.number(),
        }),
      }),
    )
    .mutation(({ input, ctx }) => {
      const { behaviourId, order } = input.data;
      return ctx.prisma.scenario.update({
        data: {
          steps: {
            create: { order, behaviourId },
          },
        },
        where: {
          id: input.scenarioId,
        },
      });
    }),
  removeStep: protectedProcedure
    .input(
      z.object({
        scenarioId: z.number(),
        stepId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { stepId, scenarioId } = input;
      await ctx.prisma.step.delete({ where: { id: stepId } });
      const steps = await ctx.prisma.step.findMany({ where: { scenarioId }, select: { order: true, id: true } });

      return ctx.prisma.scenario.update({
        data: {
          steps: {
            updateMany: steps.map((step, i) => ({
              where: { id: step.id },
              data: { order: i + 1 },
            })),
          },
        },
        where: { id: scenarioId },
      });
    }),
  reorderSteps: protectedProcedure
    .input(
      z.object({
        scenarioId: z.number(),
        steps: z.array(z.object({ id: z.number() })),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.scenario.update({
        data: {
          steps: {
            updateMany: input.steps.map((s, i) => ({
              where: { id: s.id },
              data: { order: i + 1 },
            })),
          },
        },
        where: { id: input.scenarioId },
      });
    }),
});
