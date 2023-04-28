import { Page } from '@playwright/test';
import { waitFor } from './wait-for';

export async function verifyElementVisibility(page: Page, selector: string, negate = false) {
  await waitFor(async () => Boolean(await page.$(selector)) === !negate);
}

export async function verifyElementContainsText(page: Page, selector: string, text: string, negate = false) {
  const element = await page.waitForSelector(selector);
  const elementText = await element.textContent();

  return Boolean(elementText?.includes(text)) === !negate;
}
