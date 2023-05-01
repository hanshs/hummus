import { Page } from '@playwright/test';
import { getElement } from './get-element';

export async function clickElement(page: Page, selector: string) {
  const element = await getElement(page, selector);

  element.click();
}

export async function inputElementValue(page: Page, selector: string, input: string) {
  const element = await getElement(page, selector);

  element.focus();
  element.fill(input);
}
