import { Page } from '@playwright/test';
import { waitFor } from './wait-for';

export async function navigateToLocation(page: Page, location: string) {
  const url = new URL(location);

  return page.goto(url.href);
}

export async function currentPathMatchesLocation(page: Page, location: string) {
  return waitFor(() => new URL(page.url()).pathname === location);
}

// const pathMatchesPageId = (path: string, pageId: PageId, pagesConfig: PagesConfig) => {
//   const pageRegexString = pagesConfig[pageId].regex;
//   const pageRegex = new RegExp(pageRegexString);

//   return pageRegex.test(path);
// };
