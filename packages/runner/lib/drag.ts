import { Locator } from "@playwright/test";

/**
 * drag locator from center of element to center of target locator element
 */
export async function dragAndDrop(locatorToDrag: Locator, locatorDragTarget: Locator) {
    const toDragBox = await locatorToDrag.boundingBox();
    const dragTargetBox = await locatorDragTarget.boundingBox();

    await this.page.mouse.move(toDragBox!.x + toDragBox!.width / 2, toDragBox!.y + toDragBox!.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(dragTargetBox!.x + dragTargetBox!.width / 2, dragTargetBox!.y + dragTargetBox!.height / 2);
    await this.page.mouse.up();
}