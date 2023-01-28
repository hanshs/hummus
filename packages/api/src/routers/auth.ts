import bcrypt from 'bcryptjs'
import { TRPCError } from "@trpc/server";
import { verify } from "@hummus/auth";
import { publicProcedure, protectedProcedure } from "../procedure";
import { trpc } from '../trpc';
import { z } from 'zod';

const authSchema = z.object(
  {
    username: z.string().min(4).max(50),
    password: z.string().min(4),
  }
)

export const authRouter = trpc.router({
  login: publicProcedure.input(authSchema).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findFirst({ where: { username: input.username } })

    if (user) {
      const matches = await verify(input.password, user.password)

      if (matches) {
        ctx.session.isLoggedIn = true
        ctx.session.userId = user.id
        ctx.session.token = user.accessToken
        ctx.session.username = user.username

        if ('save' in ctx.session) await ctx.session.save();

        return ctx.session
      }
    }

    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Invalid credentials.'
    })
  }),
  signup: publicProcedure.input(authSchema).mutation(async ({ ctx, input }) => {
    const { username, password } = input;
    const user = await ctx.prisma.user.findFirst({ where: { username } })

    if (user) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'This username is not available.'
      })
    }

    return ctx.prisma.user.create({
      data: { username, password: await bcrypt.hash(password, 10) },
    });
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    if ('destroy' in ctx.session) await ctx.session.destroy()
  })
});
