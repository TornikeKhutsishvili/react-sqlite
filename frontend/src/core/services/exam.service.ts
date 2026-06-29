import { BASE_URL, getHeaders } from "../api/api";
import type { IExam, IExamPayload } from "../interfaces/exam.interfaces";

export const examService = {
  getAll: async (): Promise<IExam[]> => {
    const res = await fetch(`${BASE_URL}/exams`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch exams');
    return res.json();
  },

  create: async (payload: IExamPayload): Promise<IExam> => {
    const res = await fetch(`${BASE_URL}/exams`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create exam');
    return res.json();
  },

  update: async (id: number, payload: IExamPayload): Promise<{ message: string }> => {
    const res = await fetch(`${BASE_URL}/exams/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update exam');
    return res.json();
  },

  remove: async (id: number): Promise<{ message: string }> => {
    const res = await fetch(`${BASE_URL}/exams/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete exam');
    return res.json();
  },
};