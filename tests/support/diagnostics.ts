import type { Page, TestInfo } from '@playwright/test';
import { buildTestDiagnostics } from '@/reporting/test-diagnostics';

export async function attachFailureDiagnostics(page: Page, testInfo: TestInfo): Promise<void> {
  if (testInfo.status === testInfo.expectedStatus) return;

  await testInfo.attach('test-diagnostics', {
    body: buildTestDiagnostics(testInfo),
    contentType: 'text/plain',
  });

  if (!page.isClosed()) {
    await testInfo.attach('failure-screenshot', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }
}
