import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Block external font requests that prevent page load in sandboxed environments
    await page.route('**/*.googleapis.com/**', route => route.abort());
    await page.route('**/*.gstatic.com/**', route => route.abort());
    await use(page);
  },
});

export { expect } from '@playwright/test';
