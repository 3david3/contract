import type { Page } from '@playwright/test';

/**
 * Locator QA owns these selectors.
 * Consumers should use NoteHomePage rather than importing this module.
 */
export const noteHomeLocators = (page: Page) => ({
  addNewNote: page.getByTestId('add-new-note'),
});
