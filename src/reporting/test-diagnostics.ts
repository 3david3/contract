import type { TestInfo } from '@playwright/test';

export function buildTestDiagnostics(testInfo: TestInfo): string {
  return [
    `Test: ${testInfo.title}`,
    `Project: ${testInfo.project.name}`,
    `Worker: ${testInfo.workerIndex}`,
    `Status: ${testInfo.status}`,
    `Expected: ${testInfo.expectedStatus}`,
    `Retry: ${testInfo.retry}`,
    `Duration: ${testInfo.duration}ms`,
    `Output: ${testInfo.outputDir}`,
    `URL: ${testInfo.annotations.find((a) => a.type === 'test-url')?.description ?? 'not recorded'}`,
  ].join('\n');
}
