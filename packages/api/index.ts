import { authRouter } from './src/routers/auth';
import { behavioursRouter } from './src/routers/behaviours';
import { featureRouter } from './src/routers/features';
import { paramsRouter } from './src/routers/params';
import { projectsRouter } from './src/routers/projects';
import { scenariosRouter } from './src/routers/scenarios';
import { stepsRouter } from './src/routers/step';
import { trpc } from './src/trpc';

export { createTRPCContext } from './src/context'

export const appRouter = trpc.router({
    auth: authRouter,
    projects: projectsRouter,
    features: featureRouter,
    scenarios: scenariosRouter,
    behaviours: behavioursRouter,
    params: paramsRouter,
    steps: stepsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;