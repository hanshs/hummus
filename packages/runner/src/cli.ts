#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

import { getProject } from './manager';
import { generate } from './generator';
import { resolveConfig } from './config';

function loadConfig() {
  const configPath = path.join(process.cwd(), 'hummus.config.ts');
  const config = require(configPath).default;

  return resolveConfig(config);
}

function cleanDirectory(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

async function run() {
  const config = loadConfig();

  log('Config loaded!');

  const project = await getProject(config);

  log(`Project "${project?.name}" retrieved!`);

  cleanDirectory(config.dir);
  await generate(project, config);

  log(`Test files generated!`);
  log('Executing spec ...');

  spawn('npx', ['playwright', 'test', config.dir, '--headed'], { stdio: 'inherit', shell: true });
}

function log(...args: any[]) {
  console.log(`@hummus: ${args.join('')}`);
}

run();
