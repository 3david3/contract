import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import { getEnvironmentBaseURL } from './environments';

export function getBaseURL(): string {
  const value = getEnvironmentBaseURL();

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('BASE_URL must be a valid URL.');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('BASE_URL must use http:// or https://.');
  }

  return value.replace(/\/$/, '');
}

export function getTestCredentials(): { email: string; password: string } {
  const email = process.env.TEST_USER_EMAIL?.trim();
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env or CI secrets. Do not hard-code test credentials.',
    );
  }

  return { email, password };
}

export function getAuthFile(): string {
  return path.join(process.cwd(), 'playwright/.auth/user.json');
}
