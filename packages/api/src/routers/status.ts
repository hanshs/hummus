import { publicProcedure } from "../procedure";
import { trpc } from "../trpc";


export const statusRouter = trpc.router({
    ping: publicProcedure.query(() => 'pong')
});
