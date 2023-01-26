import { z } from "zod";
import { protectedProcedure } from "../procedure";
import { trpc } from "../trpc";

export const paramsRouter = trpc.router({
    byType: protectedProcedure.input(z.object({ type: z.string() })).query(({ input, ctx }) => {
        return ctx.prisma.param.findMany({
            where: {
                type: {
                    type: input.type
                }
            },
            select: {
                id: true,
                name: true
            }
        });
    }),
});
