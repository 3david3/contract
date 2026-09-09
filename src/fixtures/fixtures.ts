import { test as base, expect as baseExpect } from '@playwright/test';
import { NotesApiClient } from '@/api/clients/notes.client';
import { createUniqueNoteData, type UniqueNoteData } from '../../tests/support/note-data';

export type FrameworkFixtures = {
  notesApi: NotesApiClient;
  uniqueNote: UniqueNoteData;
};

export const test = base.extend<FrameworkFixtures>({
  notesApi: async ({ request }, use) => {
    await use(new NotesApiClient(request));
  },
  uniqueNote: async ({}, use, testInfo) => {
    const browserName = testInfo.project.name;
    await use(createUniqueNoteData(browserName, testInfo.workerIndex));
  },
});

export const expect = baseExpect;
