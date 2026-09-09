import { test, expect } from '@/fixtures/fixtures';
import { attachFailureDiagnostics } from '../support/diagnostics';
import { contracts } from '@company/ui-locator-contract';
import { noteHomeLocators } from '../../packages/ui-locator-contract/src/locators/note-home.locators';
import { noteRegistrationLocators } from '../../packages/ui-locator-contract/src/locators/note-registration.locators';
import { setupAdBlocker } from '@/utils/helpers/adhandler';
import { cleanupAtThreshold } from '../support/test-lifecycle';

test.afterEach(async ({ page, request }, testInfo) => {
  await attachFailureDiagnostics(page, testInfo);
  await cleanupAtThreshold(request, testInfo);
});

test.beforeEach(async ({ page }) => {
  await setupAdBlocker(page);
});

test.describe('UI Locator Contract - Notes', () => {
  test('Note Home contract exposes a healthy Add New Note control', { tag: '@QAlocators' }, async ({ page }) => {
    const locators = noteHomeLocators(page);

    await page.goto('/notes/app');

    await expect(locators.addNewNote).toHaveCount(1);
    await expect(locators.addNewNote).toBeVisible();
    await expect(locators.addNewNote).toBeEnabled();
  });

  test('Note Registration contract exposes all required controls', { tag: '@QAlocators' }, async ({ page }) => {
    const home = noteHomeLocators(page);
    const registration = noteRegistrationLocators(page);

    await page.goto('/notes/app');
    await expect(home.addNewNote).toBeVisible();
    await home.addNewNote.click();

    await expect(registration.modal).toBeVisible();
    await expect(registration.category).toBeVisible();
    await expect(registration.title).toBeVisible();
    await expect(registration.description).toBeVisible();
    await expect(registration.submit).toBeVisible();
    await expect(registration.submit).toBeEnabled();
  });

  test('Public Notes contract can open the create-note form', { tag: ['@QA', '@QAlocators'] }, async ({ page }) => {
    const notes = contracts.notes(page);

    await notes.open();
    await notes.openCreateNoteForm();

    const registration = noteRegistrationLocators(page);
    await expect(registration.modal).toBeVisible();
  });

  test('Public Notes contract can create a note', { tag: ['@QA', '@QAlocators'] }, async ({ page, uniqueNote }) => {
    const notes = contracts.notes(page);
    const note = uniqueNote;

    await notes.open();
    await notes.createNote(note);
  });
});
