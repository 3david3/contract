import { test, expect } from '@playwright/test';
import { createNoteData } from '@/test-data/note.factory';

test('note factory generates unique framework-owned data', () => {
  const a = createNoteData({ browserName: 'chromium', workerIndex: 0 });
  const b = createNoteData({ browserName: 'chromium', workerIndex: 1 });
  expect(a.title).toContain('E2E Note |');
  expect(a.title).not.toBe(b.title);
  expect(a.description).toContain('Created by Playwright');
});

