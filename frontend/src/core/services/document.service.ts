import { BASE_URL, getHeaders } from "../api/api";
import type { IDocument, IDocumentPayload } from "../interfaces/document.interfaces";

export const documentService = {
  getAll: async (): Promise<IDocument[]> => {
    const res = await fetch(`${BASE_URL}/documents`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  create: async (payload: IDocumentPayload): Promise<IDocument> => {
    const res = await fetch(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create document');
    return res.json();
  },

  update: async (id: number, payload: IDocumentPayload): Promise<{ message: string }> => {
    const res = await fetch(`${BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update document');
    return res.json();
  },

  remove: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
  },
};