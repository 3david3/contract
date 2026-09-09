import { test } from '@/fixtures/fixtures';
import { attachFailureDiagnostics } from '../../support/diagnostics';
import { contracts } from '@company/ui-locator-contract';
import { setupAdBlocker } from '@/utils/helpers/adhandler';
import { verifyNoteCardsQty } from '@/utils/helpers/verifynotecardsqty';
import { cleanupAtThreshold } from '../../support/test-lifecycle';

test.afterEach(async ({ page, request }, testInfo) => {
  await attachFailureDiagnostics(page, testInfo);
  await cleanupAtThreshold(request, testInfo);
});

test.beforeEach(async ({ page, request }) => {
  await setupAdBlocker(page);
  await verifyNoteCardsQty(page, request);
});

test.describe('Notes Validation', () => {
  test('Should open the page and create a note', { tag: ['@QA', '@dev'] }, async ({ page, uniqueNote }) => {
    const notes = contracts.notes(page);
    const note = uniqueNote;

    console.log(`Creating unique test note: ${note.title}`);

    await notes.open();
    await notes.createNote(note);
  });
});
