import { test, expect } from '@playwright/test';
import { deleteAllNotes } from '@/utils/api/notes-api';

test.describe.configure({ mode: 'serial' });

test('delete_all_notes', async ({ request, browserName }) => {
  // Keep this dedicated API test running only in Chromium, as configured by
  // the project matrix. UI tests no longer launch this test with execSync().
  if (browserName !== 'chromium') {
    test.skip();
  }

  const deletedCount = await deleteAllNotes(request);
  console.log(`Deleted ${deletedCount} note(s).`);

  expect(deletedCount).toBeGreaterThanOrEqual(0);
});
