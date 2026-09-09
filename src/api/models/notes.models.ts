export interface NoteItem {
  id: number;
  category?: string;
  title?: string;
  description?: string;
}

export interface NotesApiResponse {
  data: NoteItem[];
}
