import { initTRPC } from "@trpc/server";
import { transformer } from "../transformer";
import { createContext } from "./context";
/**
 * This is where the trpc api is initialized, connecting the context and transformer
 */
export const trpc = initTRPC.context<typeof createContext>().create({
  transformer,
  errorFormatter({ shape }) {
    return shape;
  },
});
