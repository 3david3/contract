import type { Page } from '@playwright/test';
import { noteHomeLocators } from '../locators/note-home.locators';

/**
 * Internal implementation detail. Not exported from the package root.
 */
export class NoteHomePage {
  private readonly locators: ReturnType<typeof noteHomeLocators>;

  constructor(page: Page) {
    this.locators = noteHomeLocators(page);
  }

  /** Opens the New Note form. */
  async openAddRecordForm(): Promise<void> {
    await this.locators.addNewNote.click();
  }
}
