import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  //  reset mutable state here?
}

export default globalSetup;
