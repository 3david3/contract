import type { APIRequestContext } from '@playwright/test';
import { NotesApiClient } from '@/api/clients/notes.client';

/** Backward-compatible facade. New code should use NotesApiClient directly. */
export async function getNotes(request: APIRequestContext) {
  return new NotesApiClient(request).list();
}

export async function deleteNotesAboveLimit(request: APIRequestContext, maxNotes: number) {
  return new NotesApiClient(request).deleteAboveLimit(maxNotes);
}

export async function deleteAllNotes(request: APIRequestContext) {
  return new NotesApiClient(request).deleteAll();
}
