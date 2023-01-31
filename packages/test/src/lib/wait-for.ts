export async function waitFor<T>(
    predicate: () => T | Promise<T>,
    options: { timeout: number; interval: number } = { timeout: 10000, interval: 2000 }
): Promise<T> {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const startDate = new Date();

    while (new Date().getTime() - startDate.getTime() < options.timeout) {
        const result = await predicate();

        if (result) return result;
        await sleep(options.interval);

        console.log(`Waiting ${options.interval}ms`);
    }

    throw new Error(`Wait time of ${options.timeout}ms exceeded`);
}