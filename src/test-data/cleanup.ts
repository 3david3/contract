import type { APIRequestContext } from '@playwright/test';
import { NotesApiClient } from '@/api/clients/notes.client';

export const TEST_NOTE_PREFIX = 'E2E Note |';
// Threshold can be updated with a minimum of >= 4
export const NOTE_CLEANUP_THRESHOLD = 24;

/** Retain all notes below 24. At 24+, delete only framework-owned notes. */
export async function cleanupFrameworkNotesAtThreshold(request: APIRequestContext): Promise<{ total: number; deleted: number }> {
  const api = new NotesApiClient(request);
  const notes = await api.list();
  if (notes.length < NOTE_CLEANUP_THRESHOLD) return { total: notes.length, deleted: 0 };

  const frameworkNotes = notes.filter((note) => note.title?.startsWith(TEST_NOTE_PREFIX));
  for (const note of frameworkNotes) await api.delete(note.id);
  return { total: notes.length, deleted: frameworkNotes.length };
}
