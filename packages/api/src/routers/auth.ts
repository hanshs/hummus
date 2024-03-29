import bcrypt from 'bcryptjs';
import { TRPCError } from '@trpc/server';
import { publicProcedure, protectedProcedure } from '../procedure';
import { trpc } from '../trpc';
import { z } from 'zod';
import { verify } from '../utils/auth';

const authSchema = z.object({
  username: z.string().min(4).max(50),
  password: z.string().min(4),
});

export const authRouter = trpc.router({
  login: publicProcedure.input(authSchema).mutation(async ({ ctx, input }) => {
    try {
      const user = await ctx.prisma.user.findFirst({ where: { username: input.username } });

      if (user) {
        const matches = await verify(input.password, user.password);

        if (matches) {
          ctx.session.isLoggedIn = true;
          ctx.session.userId = user.id;
          ctx.session.token = user.accessToken;
          ctx.session.username = user.username;

          if ('save' in ctx.session) await ctx.session.save();

          return ctx.session;
        }
      }

      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Invalid credentials.',
      });
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to log in with these credentials.',
      });
    }
  }),
  signup: publicProcedure.input(authSchema).mutation(async ({ ctx, input }) => {
    const { username, password } = input;
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Signing up is currently not available' });
    // try {
    //     const user = await ctx.prisma.user.findFirst({ where: { username } });

    //     if (user) {
    //       throw new TRPCError({
    //         code: 'CONFLICT',
    //         message: 'This username is not available.',
    //       });
    //     }

    //     const newUser = await ctx.prisma.user.create({
    //       data: { username, password: await bcrypt.hash(password, 10) },
    //     });

    //     if (newUser) return { username: newUser.username };
    // } catch (e) {
    //     throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    // }
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return 'you can see this secret message!';
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    if ('destroy' in ctx.session) await ctx.session.destroy();
  }),
});
