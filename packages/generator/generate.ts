import fs from 'fs';
import AbortController from 'abort-controller';
import { transformer } from '@hummus/api/transformer';
import fetch from 'node-fetch';
import { createTRPCProxyClient, httpBatchLink, httpLink } from '@trpc/client';

const credentials = {
  username: process.env.SEED_USER_USERNAME!,
  password: process.env.SEED_USER_PASSWORD!,
};

const options = {
  auth: credentials,
  projectId: 'seed-project-id',
};

// polyfill fetch & websocket
import type { Router } from '@hummus/api';

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

const file = 'generated.json';

export async function generate(options: RunnerClientOptions) {
  const session = await trpc.auth.login.mutate(options.auth);
  token = session.token;
  const project = await trpc.projects.byId.query(options.projectId);
  fs.writeFileSync('generated.json', JSON.stringify(project));
  console.log(`----------------------------------------------------`);
  console.log(`Generated project "${project?.name}" into ${file}`);
  console.log(`----------------------------------------------------`);
}

generate(options);
