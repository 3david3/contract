const profiles: Record<string, string> = {
  local: 'http://localhost:3000',
  dev: 'https://practice.expandtesting.com',
  qa: 'https://practice.expandtesting.com',
};

export function resolveEnvironment(): string {
  return process.env.TEST_ENV?.trim().toLowerCase() || 'dev';
}

export function getEnvironmentBaseURL(): string {
  const environment = resolveEnvironment();
  const explicit = process.env.BASE_URL?.trim();
  const url = explicit || profiles[environment];
  if (!url) throw new Error(`Unknown TEST_ENV "${environment}". Use local, dev, qa, or provide BASE_URL.`);
  return url.replace(/\/$/, '');
}
