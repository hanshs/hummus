import { Page } from "@playwright/test";

export async function navigateToPage(page: Page, destination: string) {
	const url = new URL(destination);

	await page.goto(url.href);
}

// export const currentPathMatchesPageId = (page: Page, pageId: string) => {
// 	const { pathname: currentPath } = new URL(page.url());
// 	return pathMatchesPageId(currentPath, pageId, world.globalConfig.pagesConfig);
// };

// const pathMatchesPageId = (path: string, pageId: PageId, pagesConfig: PagesConfig) => {
// 	const pageRegexString = pagesConfig[pageId].regex;
// 	const pageRegex = new RegExp(pageRegexString);

// 	return pageRegex.test(path);
// };