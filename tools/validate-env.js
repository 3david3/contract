const dotenv = require('dotenv');

dotenv.config();

const defaultBaseUrl = 'https://practice.expandtesting.com';
const baseUrl = (process.env.BASE_URL || defaultBaseUrl).trim();
const email = (process.env.TEST_USER_EMAIL || '').trim();
const password = process.env.TEST_USER_PASSWORD || '';

const errors = [];

try {
  const url = new URL(baseUrl);
  if (!['http:', 'https:'].includes(url.protocol)) {
    errors.push('BASE_URL must use http:// or https://.');
  }
} catch {
  errors.push('BASE_URL must be a valid URL.');
}

if (!email) errors.push('TEST_USER_EMAIL is missing.');
if (!password) errors.push('TEST_USER_PASSWORD is missing.');

if (errors.length) {
  console.error('Environment validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Environment validation passed.');
console.log(`BASE_URL: ${baseUrl}`);
console.log('TEST_USER_EMAIL: configured');
console.log('TEST_USER_PASSWORD: configured');
