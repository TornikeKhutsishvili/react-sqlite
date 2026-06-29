export interface IDocument {
  id: number;
  teacher_id: number;
  name: string;
  type?: string;
  description?: string;
  content?: string;
  created_at?: string;
}

export interface IDocumentPayload {
  name: string;
  type?: string;
  description?: string;
  content?: string;
}