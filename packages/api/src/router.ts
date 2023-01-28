import { authRouter } from "./routers/auth";
import { behavioursRouter } from "./routers/behaviours";
import { featureRouter } from "./routers/features";
import { paramsRouter } from "./routers/params";
import { projectsRouter } from "./routers/projects";
import { scenariosRouter } from "./routers/scenarios";
import { statusRouter } from "./routers/status";
import { stepsRouter } from "./routers/step";
import { trpc } from "./trpc";

export const router = trpc.router({
    status: statusRouter,
    auth: authRouter,
    projects: projectsRouter,
    features: featureRouter,
    scenarios: scenariosRouter,
    behaviours: behavioursRouter,
    params: paramsRouter,
    steps: stepsRouter,
});
