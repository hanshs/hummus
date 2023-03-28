import fs from 'fs';
import path from 'path';
import { Feature, Params, Project, Scenario, Step } from './manager';

interface IGenerateOptions {
  dir: string;
}

export async function generate(project: Project, options: IGenerateOptions) {
  if (project?.features) {
    for (const feature of project.features) {
      const dir = path.join(process.cwd(), options.dir);
      const file = path.join(
        dir,
        `${feature.title?.toLowerCase().split(' ').join('-') || `untitled-feature-${randomString(4)}`}.spec.ts`,
      );

      const code: string[] = [
        `import { test, expect, Page } from '@playwright/test';
        import { testBehaviour } from '@hummus/runner';`,
      ];

      // for every scenario generate a test function
      // for (const scenario of feature.scenarios) {
      // code.push(`test.describe('${feature.title || `untitled-scenario-${randomString(4)}`}', async () => {
      //     ${generateScenarios(feature)}
      //   });`);
      code.push(generateScenarios(feature));

      // }

      //   const dir = path.join(process.cwd(), '.temp');
      //   const specFile = path.join(dir, 'hummus.spec.ts');

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      await fs.promises.writeFile(file, code.join('\r\n'));
    }
  } else {
    throw new Error('Project has no features');
  }
}

function generateScenarios(feature: Feature) {
  const code: string[] = [];

  for (const scenario of feature.scenarios) {
    code.push(`test('${feature.title} > ${scenario.name || `untitled-scenario-${randomString(4)}`}', async ({page}) => {
      ${generateScenarioSteps(scenario.steps)}
    });`);
  }

  return code.join('\r\n');
}

function generateScenarioSteps(steps: Step[]) {
  return steps
    .sort((step, next) => step.order - next.order)
    .map((step) => {
      return `await test.step('${step.order}. ${replaceStepParams(step.behaviour.value, step.params)}', async () => {
        await testBehaviour('${step.behaviour.value}', ${JSON.stringify(step.params)}, page);
      });`;
    })
    .join('\r\n');
}

// function that creates arandom string
function randomString(length: number) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function replaceStepParams(step: string, params: Params) {
  for (const param of params) {
    step = step.replace(`<${param.type}>`, `"${param.name}"`);
  }
  return step;
}
