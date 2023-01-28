
import AbortController from 'abort-controller';
import { transformer } from '@hummus/api/transformer';
import fetch from 'node-fetch';
import { exec } from 'child_process'
// import env from 'dotenv'
// polyfill fetch & websocket
import { createTRPCProxyClient, httpBatchLink, HttpBatchLinkOptions, loggerLink } from '@trpc/client';

import type { Router } from '@hummus/api';

const globalAny = global as any;
globalAny.AbortController = AbortController;
globalAny.fetch = fetch;

let accessToken: string | undefined = undefined

const trpc = createTRPCProxyClient<Router>({
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


function runTest() {
    const subprocess = exec('npx playwright test'
        // , {
        //     // cwd: config.workspaceFolder,
        //     stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe'],
        //     // env: { ...process.env }

        // }
    );
    // const { stdio: [writeable, readable] } = subprocess
    // const { stdin, stdout, stderr } = subprocess
    // const [writeable, readable] = stdio
    if (subprocess.stdin) {
        subprocess.stdin.on('data', (data) => console.log('stdin data: ', data))
    }
    // stdout.on('data', (data) => console.log('stdout data: ', data))
    if (subprocess.stderr) {
        subprocess.stderr.on('data', (data) => console.log('stderr data: ', data))
        // stdio[1].on('data', data => listener.onStdOut?.(data));
        // stdio[2].on('data', data => listener.onStdErr?.(data));
    }

}


class RunnerClient {
    private options: RunnerClientOptions
    private token?: string
    private trpc = createTRPCProxyClient<Router>({
        transformer,
        links: [httpBatchLink({ url: 'http://localhost:4000', headers: { Authentication: this.token } })]
    })
    private async authenticate() {
        const session = await this.trpc.auth.login.mutate(this.options.auth)
        this.token = session.token
    }

    constructor(options: RunnerClientOptions) {
        this.options = options
        this.authenticate()
    }

    public get project() {
        return this.trpc.projects.byId.query(this.options.projectId)
    }

}

// async function main() {
//     const options = {
//         auth: { username: '', password: '' },
//         projectId: 'seed-project-id'
//     }
//     const client = new RunnerClient(options)
//     const projects = await client.project
//     console.log(projects)
// }

interface RunnerClientOptions {
    auth: { username: string, password: string }
    projectId: string
}

    // main()
    // runTest()
