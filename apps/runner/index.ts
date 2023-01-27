import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';

import type { AppRouter } from '@hummus/api';
import { transformer } from '@hummus/api/transformer';
import fetch from 'node-fetch';

// polyfill fetch & websocket
const globalAny = global as any;
globalAny.AbortController = AbortController;
globalAny.fetch = fetch;

let token: string
const trpc = createTRPCProxyClient<AppRouter>({
    transformer: transformer,
    links: [
        httpBatchLink({
            url: 'http://localhost:4000',
            headers() {
                return {
                    Authorization: token,
                };
            },
        }),
        // loggerLink()
    ]
});

async function main() {
    const user = await trpc.auth.login.mutate({ username: 'testman', password: 'topsecret' })
    token = user.token
    // console.log(login.token)
    const project = await trpc.projects.byId.query('seed-project-id')

}
main()