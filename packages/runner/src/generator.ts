import fs from 'fs';
import path from 'path';
import { Behaviour, BehaviourSubStep, Feature, Param, Project, Scenario, Step } from './manager';

interface GenerateOptions {
  /** directory where tests will be written */
  dir: string;
}

export async function generate(project: Project, options: GenerateOptions) {
  if (project?.features) {
    for (const feature of project.features) {
      const dir = path.join(process.cwd(), options.dir);
      const file = path.join(
        dir,
        `${feature.title?.toLowerCase().split(' ').join('-') || `untitled-feature-${randomString(4)}`}.spec.ts`,
      );

      const code: string[] = [
        `import { test, expect, Page } from '@playwright/test';`,
        `import { testBehaviour } from '@hummus/runner';`,
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
    code.push(`
test('${feature.title} > ${scenario.name || `untitled-scenario-${randomString(4)}`}', async ({page}) => {
  ${generateScenarioSteps(scenario.steps)}
});
    `);
  }

  return code.join('\r\n');
}

function generateScenarioSteps(steps: Step[]) {
  const sorted = steps.sort((step, next) => step.order - next.order);
  const code: string[] = [];

  const createStepTest = (step: Step, content: string) => {
    return `
  await test.step('${step.order}. ${replaceStepParams(step.behaviour.value, step.params)}', async () => {
    ${content}
  });
    `;
  };

  const createBehaviourTest = (behaviour: Pick<Behaviour, 'value'>, params: Param[]) => {
    const paramList = params.map((p) => ({ name: p.name, value: p.value, type: p.type }));

    return `
    await testBehaviour('${behaviour.value}', ${JSON.stringify(paramList)}, page);
    `;
  };

  const createSubStepTest = (subSteps: BehaviourSubStep[]) =>
    subSteps
      .sort((step, next) => step.order - next.order)
      .map((step) => createBehaviourTest(step.behaviour, step.params))
      .join('\r\n');

  for (const step of sorted) {
    if (step.behaviour.subSteps.length) {
      code.push(createStepTest(step, createSubStepTest(step.behaviour.subSteps)));
    } else {
      code.push(createStepTest(step, createBehaviourTest(step.behaviour, step.params)));
    }
  }

  return code.join('\r\n');
}

// function that creates arandom string
function randomString(length: number) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function replaceStepParams(step: string, params: Param[]) {
  for (const param of params) {
    step = step.replace(`<${param.type}>`, `"${param.name}"`);
  }
  return step;
}
