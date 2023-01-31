import { RouterOutputs } from '@hummus/api';
import { test, expect } from '@playwright/test';

// inferQuery
export type Project = RouterOutputs['projects']['byId'];
export type Feature = NonNullable<Project>['features'][number];
export type Scenario = Feature['scenarios'][number];
export type Step = Scenario['steps'][number];
export type Params = Step['params'];

function replaceStepParams(step: string, params: Params) {
  for (const param of params) {
    step = step.replace(`<${param.type.type}>`, `"${param.name}"`);
  }
  return step;
}

function testScenario(scenario: Scenario) {
  test(scenario.name || 'Untitled scenario', async () => {
    for (const step of scenario.steps.sort((step, next) => step.order - next.order)) {
      // await test.step(`${step.order}. ${replaceStepParams(step)}`, async () => {

      await test.step(`${step.order}. ${replaceStepParams(step.behaviour.value, step.params)}`, async () => {
        expect(true).toBe(true);
      });
    }
  });
}

function testFeature(feature: Feature) {
  test.describe(feature.title || 'Untitled feature', () => {
    for (const scenario of feature.scenarios) testScenario(scenario);
  });
}

export function testProject(project: Project) {
  if (project?.features) {
    for (const feature of project.features) testFeature(feature);
  } else {
    throw new Error('Project has no features');
  }
}

// function replaceStepParams(step: Step) {
//     const getParamName = (type: Param['type']) => step.params.find(p => p.type === type)?.name

//     return step.name
//         .replace('<selector>', getParamName('selector') || 'selector doesnt exist')
//         .replace('<location>', getParamName('location') || 'location doesnt exist')
//         .replace('<text>', getParamName('text') || 'text doesnt exist')
//     // .replace('<value>', getParamName('value') || 'value doesnt exist')
// }

// async function main() {

//     const project = await client.project

//     testProject(project)
// }

// main()
