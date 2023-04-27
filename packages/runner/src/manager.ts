import type { RouterOutputs, Router } from '@hummus/api';
import AbortController from 'abort-controller';
import { transformer } from '@hummus/api/transformer';
import fetch from 'node-fetch';
import { createTRPCProxyClient, httpLink } from '@trpc/client';

export type Project = RouterOutputs['projects']['byId'];
export type Feature = NonNullable<Project>['features'][number];
export type Scenario = Feature['scenarios'][number];
export type Step = Scenario['steps'][number];
export type Behaviour = Step['behaviour'];
export type BehaviourSubStep = Step['behaviour']['subSteps'][number];
export type Param = Step['params'][number];

const globalAny = global as any;
globalAny.AbortController = AbortController;
globalAny.fetch = fetch;

interface RunnerClientOptions {
  auth: {
    username: string;
    password: string;
  };
  projectId: string;
}

export async function getProject(options: RunnerClientOptions) {
  let token;
  const trpc = createTRPCProxyClient<Router>({
    transformer,
    links: [
      httpLink({
        url: 'http://localhost:4000',
        headers() {
          return {
            Authorization: token,
          };
        },
      }),
    ],
  });
  const session = await trpc.auth.login.mutate(options.auth);
  token = session.token;

  return await trpc.projects.byId.query(options.projectId);
}
