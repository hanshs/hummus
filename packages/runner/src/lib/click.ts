import { Page } from '@playwright/test';
import { waitFor, waitForSelector } from './wait-for';

export async function click(page: Page, selector: string) {
  const element = await page.waitForSelector(selector);
  if (element) {
    element.click();
  }
}
