export { NotesContract } from './contracts/notes.contract';
export { notesContractMetadata } from './metadata/notes.metadata';
export type { NoteDetails } from './pages/NoteRegistrationPage';

import type { Page } from '@playwright/test';
import { NotesContract } from './contracts/notes.contract';

/**
 * Single entry point for Team B to consume UI contracts.
 */
export const contracts = {
  notes: (page: Page) => new NotesContract(page),
};
