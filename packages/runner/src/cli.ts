#!/usr/bin/env tsx

import path from 'path';
import { spawn } from 'child_process';

import { getProject } from './manager';
import { generate } from './generator';
import { resolveConfig } from './config';

const args = process.argv.slice(2);
const dir = args.find((s) => s.startsWith('--dir'))?.split('=')[1] || '';

function loadConfig() {
  const configPath = path.join(process.cwd(), dir, 'hummus.config.ts');
  const config = require(configPath).default;

  return resolveConfig(config);
}

async function run() {
  log('Loading config ...');
  const config = loadConfig();
  log('Config loaded!');

  log(`Retrieving project ...`);
  const project = await getProject(config);
  log(`Project "${project?.name}" retrieved!`);

  log(`Generating test files ...`);
  await generate(project, config);
  log(`Test files generated!`);

  log('Executing spec using Playwright ...');

  spawn('npx', ['playwright', 'test', `--config=${dir}`, dir], { stdio: 'inherit', shell: true });
}

function log(...args: any[]) {
  console.log(`@hummus: ${args.join('')}`);
}

run();
