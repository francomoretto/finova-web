import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --host 127.0.0.1`,
    url: BASE_URL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
    env: {
      // Astro 7 demoniza `astro preview` cuando detecta un entorno de agente/CI,
      // y entonces Playwright ve que el proceso "termina antes de tiempo".
      // Esta variable desactiva esa detección y fuerza el modo foreground.
      ASTRO_PREVIEW_BACKGROUND: '1',
    },
  },
});
