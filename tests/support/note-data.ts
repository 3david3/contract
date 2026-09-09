import { createNoteData, type NoteData } from '@/test-data/note.factory';

export type UniqueNoteData = Omit<NoteData, 'runId'>;

export function createUniqueNoteData(browserName: string, workerIndex: number): UniqueNoteData {
  const note = createNoteData({ browserName, workerIndex });
  return { category: note.category, title: note.title, description: note.description };
}
