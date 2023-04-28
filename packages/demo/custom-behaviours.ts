import { test, expect, type Page } from '@playwright/test';

export function refreshBrowser(page: Page) {
  return page.reload();
}
