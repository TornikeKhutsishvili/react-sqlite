/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { IDocument, IDocumentPayload } from '../../core/interfaces/document.interfaces';
import { documentService } from '../../core/services/document.service';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getAll();
      setDocuments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addDocument = async (payload: IDocumentPayload) => {
    try {
      const newDoc = await documentService.create(payload);
      setDocuments((prev) => [...prev, newDoc]);
    } catch (err: any) {
      setError(err.message || 'Failed to add document');
    }
  };

  const updateDocument = async (id: number, payload: IDocumentPayload) => {
    try {
      await documentService.update(id, payload);
      setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...payload } : d)));
    } catch (err: any) {
      setError(err.message || 'Failed to update document');
    }
  };

  const removeDocument = async (id: number) => {
    try {
      await documentService.remove(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, loading, error, addDocument, updateDocument, removeDocument, refetch: fetchDocuments };
};