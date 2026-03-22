import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4177/test1/',
    headless: true,
    viewport: { width: 390, height: 844 },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npx vite preview --port 4177 --strictPort',
    url: 'http://localhost:4177/test1/',
    reuseExistingServer: true,
    timeout: 15000,
  },
});
