import { Page } from '@playwright/test';
import { waitForSelector } from './wait-for';

export async function clickElement(page: Page, selector: string) {
  const element = await page.waitForSelector(selector);
  if (element) {
    return element.click();
  }

  return false;
}

export const inputElementValue = async (page: Page, selector: string, input: string): Promise<void> => {
  if (await waitForSelector(page, selector)) {
    await page.focus(selector);
    await page.fill(selector, input);
  } else {
    throw new Error(`Could not find element with selector ${selector}`);
  }
};