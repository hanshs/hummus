import { Page } from "@playwright/test";
import { waitFor } from "./wait-for";

export async function verifyVisibility(page: Page, selector: string, negate = false) {
    await waitFor(async () => Boolean(await page.$(selector)) === !negate);
}