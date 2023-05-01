import { expect, Page } from '@playwright/test';
import { getElement, getElementSync } from './get-element';

export async function verifyElementVisibility(page: Page, selector: string, negate = false) {
  if (negate) expect(getElementSync(page, selector)).not.toBeVisible(); // expect(element).not.toBeVisible()
  else expect(await getElement(page, selector)).toBeVisible();

  // page.$ is discouraged to use, and it didn't work with page.locator
  // return waitFor(async () => Boolean(await page.$(selector)) === !negate);
}

export async function verifyElementContainsText(page: Page, selector: string, text: string, negate = false) {
  const element = await getElement(page, selector);
  const regex = new RegExp(text, 'gi');

  if (negate) expect(element).not.toHaveText(regex);
  else expect(element).toHaveText(regex);
}
