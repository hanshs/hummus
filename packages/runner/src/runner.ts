import type { Page } from '@playwright/test';

import type { Param } from './manager';
import { clickElement, inputElementValue } from './lib/interactions';
import { verifyDirectedToLocation, navigateToLocation } from './lib/navigation';
import { verifyElementContainsText, verifyElementVisibility } from './lib/visibility';

type ParamBase = Pick<Param, 'name' | 'type' | 'value'>;

function getParam(params: ParamBase[], type: string) {
  return params.find((p) => p.type === type);
}

export async function testBehaviour(behaviour: string, params: ParamBase[], page: Page) {
  const location = getParam(params, 'location');
  const selector = getParam(params, 'selector');
  const text = getParam(params, 'text');

  switch (behaviour) {
    case 'I am on <location>':
      if (location) return navigateToLocation(page, location.value);

    case 'I am directed to <location>':
      if (location) return verifyDirectedToLocation(page, location.value);

    case 'I click on <selector>':
      if (selector) return clickElement(page, selector.value);

    case 'I fill the <selector> with <text>':
      if (selector && text) return inputElementValue(page, selector.value, text.value);

    case 'The <selector> should contain the <text>':
      if (selector && text) return verifyElementContainsText(page, selector.value, text.value);

    case 'The <selector> should not contain the <text>':
      if (selector && text) return verifyElementContainsText(page, selector.value, text.value, true);

    case 'The <selector> should be visible':
      if (selector) return verifyElementVisibility(page, selector.value);

    case 'The <selector> should not be visible':
      if (selector) return verifyElementVisibility(page, selector.value, true);
  }

  throw new Error(`Unable to execute behaviour ${behaviour} with params - ${JSON.stringify(params)}`);
}
