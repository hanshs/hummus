import { expect, Page } from '@playwright/test';

export async function getElement(page: Page, selector: string) {
  const element = page.locator(selector);

  await element.waitFor();

  return element;
}

export function getElementSync(page: Page, selector: string) {
  return page.locator(selector);
}
