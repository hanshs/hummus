import { Page } from '@playwright/test';
import { waitForSelector } from './wait-for';

export const inputElementValue = async (page: Page, selector: string, input: string): Promise<void> => {
  if (await waitForSelector(page, selector)) {
    await page.focus(selector);
    await page.fill(selector, input);
  }

  throw new Error(`Could not find element with selector ${selector}`);
};
