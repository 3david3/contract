import { type APIRequestContext, type Page } from '@playwright/test';
import { getNotes } from '@/utils/api/notes-api';
import { cleanupFrameworkNotesAtThreshold, NOTE_CLEANUP_THRESHOLD } from '@/test-data/cleanup';



export async function verifyNoteCardsQty(
  page: Page,
  request: APIRequestContext,
): Promise<void> {
  // Use the authenticated API as the source of truth for cleanup decisions.
  // The three browser projects share the same account, so the UI can change
  // while another browser is running. Using the API avoids stale-DOM races.
  const notes = await getNotes(request);
  const countBeforeCleanup = notes.length;
  console.log(`Total number of notes found via API: ${countBeforeCleanup}`);

  if (countBeforeCleanup < NOTE_CLEANUP_THRESHOLD) {
    console.log(`Note count is ${countBeforeCleanup}. No cleanup required.`);
  } else {
    const result = await cleanupFrameworkNotesAtThreshold(request);
    console.log(`[cleanup] Threshold ${NOTE_CLEANUP_THRESHOLD} reached. Deleted ${result.deleted} framework note(s).`);
  }

  // Open the UI only after any required API cleanup is complete.
  // Do not assert zero note cards here: another browser project can create
  // a note in the shared account while this hook is running.
  await page.goto('/notes/app', { waitUntil: 'domcontentloaded' });
  await page.getByTestId('notes-list').waitFor({ state: 'visible' });

  const elements = page.getByTestId('note-card');
  console.log(`Total number of note cards visible in UI: ${await elements.count()}`);
}
