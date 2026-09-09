import { randomUUID } from 'node:crypto';

export interface NoteData {
  category: string;
  title: string;
  description: string;
  runId: string;
}

export function createNoteData(context: { browserName: string; workerIndex: number; prefix?: string }): NoteData {
  const runId = process.env.TEST_RUN_ID?.trim() || randomUUID().slice(0, 8);
  const prefix = context.prefix?.trim() || 'E2E Note';
  return {
    category: 'Work',
    title: `${prefix} | ${runId} | ${context.browserName} | worker-${context.workerIndex}`,
    description: `Created by Playwright | run=${runId} | browser=${context.browserName} | worker=${context.workerIndex}`,
    runId,
  };
}
