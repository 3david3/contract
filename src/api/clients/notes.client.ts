import fs from 'node:fs';
import path from 'node:path';
import type { APIRequestContext } from '@playwright/test';
import { getAuthFile, getBaseURL } from '@/config/test-env';
import type { NoteItem, NotesApiResponse } from '../models/notes.models';

export class NotesApiClient {
  private readonly apiUrl = new URL('/notes/api/notes', getBaseURL()).toString().replace(/\/$/, '');

  constructor(private readonly request: APIRequestContext) {}

  private getAuthToken(): string {
    const authFile = getAuthFile();
    if (!fs.existsSync(authFile)) {
      throw new Error(`Authentication state file was not found: ${path.relative(process.cwd(), authFile)}`);
    }

    const authData = JSON.parse(fs.readFileSync(authFile, 'utf-8')) as {
      origins?: Array<{ origin?: string; localStorage?: Array<{ name?: string; value?: string }> }>;
    };
    const origin = new URL(getBaseURL()).origin;
    const originData = authData.origins?.find((item) => item.origin === origin);
    const token = originData?.localStorage?.find((item) => item.name === 'token')?.value;

    if (!token) {
      throw new Error(`Authentication token was not found in ${path.relative(process.cwd(), authFile)}`);
    }
    return token;
  }

  private headers() {
    return {
      'x-auth-token': this.getAuthToken(),
      'Content-Type': 'application/json',
    };
  }

  async list(): Promise<NoteItem[]> {
    const response = await this.request.get(this.apiUrl, { headers: this.headers() });
    if (!response.ok()) throw new Error(`GET notes failed with status ${response.status()}`);
    const body = (await response.json()) as NotesApiResponse;
    return body.data ?? [];
  }

  async create(note: { category: string; title: string; description: string }): Promise<NoteItem> {
    const response = await this.request.post(this.apiUrl, { headers: this.headers(), data: note });
    if (!response.ok()) throw new Error(`POST note failed with status ${response.status()}`);
    const body = (await response.json()) as { data?: NoteItem };
    if (!body.data) throw new Error('POST note succeeded but no note was returned.');
    return body.data;
  }

  async delete(noteId: number): Promise<void> {
    const response = await this.request.delete(`${this.apiUrl}/${noteId}`, { headers: this.headers() });
    if (response.status() === 404) return;
    if (!response.ok()) throw new Error(`DELETE note ${noteId} failed with status ${response.status()}`);
  }

  async deleteAll(): Promise<number> {
    const notes = await this.list();
    for (const note of notes) await this.delete(note.id);
    return notes.length;
  }

  async deleteAboveLimit(maxNotes: number): Promise<number> {
    const notes = await this.list();
    if (notes.length <= maxNotes) return 0;
    const toDelete = notes.slice(maxNotes);
    for (const note of toDelete) await this.delete(note.id);
    return toDelete.length;
  }
}
