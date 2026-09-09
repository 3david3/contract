import type { Page } from '@playwright/test';
import { noteRegistrationLocators } from '../locators/note-registration.locators';

export interface NoteDetails {
  category: string;
  title: string;
  description: string;
}

/**
 * Internal implementation detail. Not exported from the package root.
 */
export class NoteRegistrationPage {
  private readonly locators: ReturnType<typeof noteRegistrationLocators>;

  constructor(page: Page) {
    this.locators = noteRegistrationLocators(page);
  }

  async fillRequiredDetails(details: NoteDetails): Promise<void> {
    await this.locators.modal.waitFor({ state: 'visible' });
    await this.locators.category.selectOption({ value: details.category });
    await this.locators.title.fill(details.title);
    await this.locators.description.fill(details.description);
    await this.locators.submit.click();
  }

  async update(): Promise<void> {
    await this.locators.update.click();
  }
}
