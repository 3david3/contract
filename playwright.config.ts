import dotenv from 'dotenv';

dotenv.config();
import { defineConfig, devices } from '@playwright/test';
import { getBaseURL } from '@/config/test-env';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', {
      open: 'never',
      host: '127.0.0.1',
      port: 9401
    }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  outputDir: 'test-results',
  use: {
    baseURL: getBaseURL(),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  }, 

  projects: [
    {
      name: 'setup',
      //testMatch: /.*\.setup\.ts/, // Matches your auth script, e.g., auth.setup.ts
      testMatch: /auth\.setup\.ts/,
      // This project creates user.json. Do not configure storageState here.
      // Loading user.json before this test runs causes ENOENT on a clean checkout.
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      // Chromium runs EVERYTHING (both UI and API tests)
      testMatch: /.*\.spec\.ts/, 
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      }
    },
    {
        name: 'firefox',
      dependencies: ['setup'],
      // Firefox runs everything EXCEPT the API folder
      testMatch: /.*\.spec\.ts/,
      testIgnore: /.*\/api\/.*/, 
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      }
      },
    {
      name: 'webkit',
      dependencies: ['setup'],
      // Webkit runs everything EXCEPT the API folder
      testMatch: /.*\.spec\.ts/,
      testIgnore: /.*\/api\/.*/, 
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      }
    },
  ],
});
