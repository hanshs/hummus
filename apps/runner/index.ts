import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import AbortController from 'abort-controller';
import type { AppRouter } from '@hummus/api';
import { transformer } from '@hummus/api/transformer';
import fetch from 'node-fetch';
import { exec } from 'child_process'
// import env from 'dotenv'
// polyfill fetch & websocket
const globalAny = global as any;
globalAny.AbortController = AbortController;
globalAny.fetch = fetch;

let accessToken: string | undefined = undefined

const trpc = createTRPCProxyClient<AppRouter>({
    transformer: transformer,
    links: [
        httpBatchLink({
            url: 'http://localhost:4000',
            headers() {
                return {
                    Authorization: accessToken,
                };
            },
        }),
    ]
});

const credentials = {
    username: process.env.SEED_USER_USERNAME || '',
    password: process.env.SEED_USER_PASSWORD || ''
}

async function main() {
    const session = await trpc.auth.login.mutate(credentials)
    accessToken = session.token

    const project = await trpc.projects.byId.query('seed-project-id')

    exec('npx playwright test', (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

        console.log(`stdout:\n${stdout}`);
    });
    // trpc.auth.logout.mutate()
    // token = undefined

}

main()