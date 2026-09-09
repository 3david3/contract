import type { APIRequestContext, TestInfo } from '@playwright/test';
import { cleanupFrameworkNotesAtThreshold, NOTE_CLEANUP_THRESHOLD } from './test-data-cleanup';

export async function cleanupAtThreshold(request: APIRequestContext, testInfo: TestInfo): Promise<void> {
  try {
    const result = await cleanupFrameworkNotesAtThreshold(request);
    if (result.deleted > 0) {
      console.log(`[cleanup] Threshold ${NOTE_CLEANUP_THRESHOLD} reached (${result.total} records). Deleted ${result.deleted} framework note(s).`);
    } else {
      console.log(`[cleanup] ${result.total} record(s); below threshold or no framework notes to remove.`);
    }
  } catch (error) {
    testInfo.annotations.push({ type: 'cleanup-warning', description: error instanceof Error ? error.message : String(error) });
    console.warn(`[cleanup] Warning for ${testInfo.title}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
