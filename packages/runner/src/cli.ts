#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { generate } from './generator';
import { spawn } from 'child_process';
import { getProject } from './manager';
import os from 'os';

const execAsync = promisify(exec);

const dir = '.hummus';

function loadConfig() {
  const configPath = path.join(process.cwd(), 'hummus.config.ts');
  const config = require(configPath).default;

  return config;
}

function clean(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

async function run() {
  clean(dir);
  const config = loadConfig();

  log('Config loaded!');

  const project = await getProject(config);

  log(`Project "${project?.name}" retrieved!`);

  await generate(project, { dir });

  log(`Test files generated!`);
  log('Executing spec ...');

  // try {
  //   await systemSync(`npx playwright test ${dir} -`);
  //   // await systemSync('npx playwright show-report');
  // } catch (e) {
  //   log('Exception occurred while running Playwright test cases: ', e.message);
  // }
}

async function systemSync(cmd: string) {
  const testProcess = spawn('npx', ['playwright', 'test', dir, '--headed'], { stdio: 'inherit', shell: true });

  testProcess.stdout?.on('data', (data) => {
    console.log(data);
    // process.stdout.write(data.toString().replace(/\r?\n|\r/g, os.EOL));
  });

  testProcess.stderr?.on('data', (data) => {
    console.error(data);
    // process.stderr.write(data.toString().replace(/\r?\n|\r/g, os.EOL));
  });
}

// let exitCode = 0;
// await child_process
//   .exec(cmd, (err, stdout, stderr) => {
//     log(stdout);
//     log(stderr);

//     if (err && err.code) {
//       log(err);
//       log('Exit Code: ', err.code);
//       log(`Playwright Tests - FAILED`);
//     } else {
//       log(`Playwright Tests - COMPLETED`);
//     }
//   })
//   .on('exit', (code) => {
//     log('Final exit code is: ', code);
//     if (code) {
//       exitCode = code;
//     }
//     // cleanup(path.join(process.cwd(), '.temp'));
//   });

// return exitCode;

function log(...args: any[]) {
  console.log(`@hummus: ${args.join('')}`);
}

run();
