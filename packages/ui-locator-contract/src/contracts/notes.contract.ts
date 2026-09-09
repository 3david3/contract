import type { Page } from '@playwright/test';
import { NoteHomePage } from '../pages/NoteHomePage';
import { NoteRegistrationPage, type NoteDetails } from '../pages/NoteRegistrationPage';

/**
 * Public business-level API for the Notes UI contract.
 *
 * Team B consumes this class. Locator and Page Object details stay internal
 * to the contract package.
 */
export class NotesContract {
  private readonly home: NoteHomePage;
  private readonly registration: NoteRegistrationPage;

  constructor(private readonly page: Page) {
    this.home = new NoteHomePage(page);
    this.registration = new NoteRegistrationPage(page);
  }

  /** Opens the Notes application. */
  async open(): Promise<void> {
    await this.page.goto('/notes/app');
  }

  /** Opens the New Note form. */
  async openCreateNoteForm(): Promise<void> {
    await this.home.openAddRecordForm();
  }

  /** Creates a note using the public Notes contract. */
  async createNote(details: NoteDetails): Promise<void> {
    await this.openCreateNoteForm();
    await this.registration.fillRequiredDetails(details);
  }
}
