import { z } from 'zod';
import { protectedProcedure } from '../procedure';
import { trpc } from '../trpc';

const name = z.string();
const value = z.string();
const type = z.string();
const featureId = z.string();
const paramId = z.number();
const createParamSchema = z.object({ name, value, type, featureId });
const updateParamSchema = z.object({ param: z.object({ name, value }), id: paramId });

export const paramsRouter = trpc.router({
  byType: protectedProcedure.input(z.object({ type })).query(({ input, ctx }) => {
    return ctx.prisma.param.findMany({
      where: { type: input.type },
      select: { id: true, name: true },
    });
  }),
  create: protectedProcedure.input(createParamSchema).mutation(({ input, ctx }) => {
    return ctx.prisma.param.create({ data: input });
  }),
  delete: protectedProcedure.input(z.object({ id: paramId })).mutation(({ input, ctx }) => {
    return ctx.prisma.param.delete({ where: { id: input.id } });
  }),
  update: protectedProcedure.input(updateParamSchema).mutation(({ input, ctx }) => {
    return ctx.prisma.param.update({
      where: { id: input.id },
      data: input.param,
    });
  }),
});
