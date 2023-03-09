import { RouterOutputs } from '@hummus/api';
import { test, expect, Page } from '@playwright/test';
import { click } from './lib/click';
import { inputElementValue } from './lib/input';
import { currentPathMatchesLocation, currentPathMatchesPageId, navigateToLocation } from './lib/navigator';

// inferQuery
export type Project = RouterOutputs['projects']['byId'];
export type Feature = NonNullable<Project>['features'][number];
export type Scenario = Feature['scenarios'][number];
export type Step = Scenario['steps'][number];
export type Params = Step['params'];

function replaceStepParams(step: string, params: Params) {
  for (const param of params) {
    step = step.replace(`<${param.type}>`, `"${param.name}"`);
  }
  return step;
}

function getParam(params: Params, type: string) {
  return params.find((p) => p.type === type);
}

// function iAmOnLocation()

class ParamError extends Error {
  constructor(behaviour: string, params: Params) {
    super();
    this.name = 'ParamError';
    this.message = `No param specified for ${behaviour} - ${JSON.stringify(params)}`;
  }
}

function testBehaviour(behaviour: string, params: Params, page: Page) {
  const location = getParam(params, 'location');
  const selector = getParam(params, 'selector');
  const text = getParam(params, 'text');

  let error;

  switch (behaviour) {
    case 'I am on <location>':
      if (location) return navigateToLocation(page, location.value);

    case 'I am directed to <location>':
      if (location) return currentPathMatchesLocation(page, location.value);

    case 'I click on <selector>':
      if (selector) return click(page, selector.value);

    case 'I fill the <selector> with <text>':
      if (selector && text) return inputElementValue(page, selector.value, text.value);

    // case 'the <selector> should contain the <text>':
    // case 'the <selector> should not contain the <text>':
    // case 'the <selector> should be visible':

    default:
      error = new Error(`The step definition for "${behaviour}" is not implemented.`);
  }

  if (error) throw error;
  else throw new Error(`Unable to execute behaviour ${behaviour} - ${JSON.stringify(params)}`);
}

function testScenario(scenario: Scenario) {
  test(scenario.name || 'Untitled scenario', async ({ page }) => {
    for (const step of scenario.steps.sort((step, next) => step.order - next.order)) {
      await test.step(`${step.order}. ${replaceStepParams(step.behaviour.value, step.params)}`, async () => {
        await testBehaviour(step.behaviour.value, step.params, page);
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
