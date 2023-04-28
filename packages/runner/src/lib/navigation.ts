import { Page } from '@playwright/test';
import { waitFor } from './wait-for';

function pagePathMatchesLocation(page: Page, location: string) {
  return new URL(page.url()).pathname === location;
}

export async function navigateToLocation(page: Page, location: string) {
  if (pagePathMatchesLocation(page, location)) return true;

  return page.goto(location);
}

export function verifyDirectedToLocation(page: Page, location: string) {
  return waitFor(() => pagePathMatchesLocation(page, location));
}

// const pathMatchesPageId = (path: string, pageId: PageId, pagesConfig: PagesConfig) => {
//   const pageRegexString = pagesConfig[pageId].regex;
//   const pageRegex = new RegExp(pageRegexString);

//   return pageRegex.test(path);
// };
