import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { getAuthFile, getBaseURL, getTestCredentials } from '@/config/test-env';

const authFile = getAuthFile();
const baseURL = getBaseURL();
const { email, password } = getTestCredentials();

setup('Log in via API and create authenticated storage state', async ({ request }) => {
  const response = await request.post('/notes/api/users/login', {
    data: { email, password },
  });

  const responseText = await response.text();
  let responseBody: { data?: { token?: string }; message?: string } = {};

  try {
    responseBody = JSON.parse(responseText) as typeof responseBody;
  } catch {
    // Never print the raw response because it may contain a token.
  }

  console.log(`LOGIN API STATUS: ${response.status()} ${response.statusText()}`);

  expect(
    response.ok(),
    `Login API failed: ${response.status()} ${response.statusText()}${responseBody.message ? ` - ${responseBody.message}` : ''}`,
  ).toBeTruthy();

  const token = responseBody.data?.token;
  expect(token, 'Login succeeded but no authentication token was returned.').toBeTruthy();

  const storageState = {
    cookies: [],
    origins: [
      {
        origin: new URL(baseURL).origin,
        localStorage: [{ name: 'token', value: token! }],
      },
    ],
  };

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2), { mode: 0o600 });

  console.log(`Authentication successful. Storage state written to ${path.relative(process.cwd(), authFile)}.`);
});
