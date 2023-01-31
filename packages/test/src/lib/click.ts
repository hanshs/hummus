import { Page } from "@playwright/test";
import { waitFor } from "./wait-for";

export async function click(page: Page, selector: string) {
    await waitFor(async () => {
        const element = await page.waitForSelector(selector, {
            state: 'visible',
        });
        if (element) await element.click()

        return element;
    });
}