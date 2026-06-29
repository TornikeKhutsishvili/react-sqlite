/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { IExam, IExamPayload } from '../../core/interfaces/exam.interfaces';
import { examService } from '../../core/services/exam.service';

export const useExams = () => {
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await examService.getAll();
      setExams(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addExam = async (payload: IExamPayload) => {
    try {
      const newExam = await examService.create(payload);
      setExams((prev) => [...prev, newExam]);
    } catch (err: any) {
      setError(err.message || 'Failed to add exam');
    }
  };

  const updateExam = async (id: number, payload: IExamPayload) => {
    try {
      await examService.update(id, payload);
      setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...payload, time_from: payload.timeFrom, time_to: payload.timeTo } : e)));
    } catch (err: any) {
      setError(err.message || 'Failed to update exam');
    }
  };

  const removeExam = async (id: number) => {
    try {
      await examService.remove(id);
      setExams((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete exam');
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return { exams, loading, error, addExam, updateExam, removeExam, refetch: fetchExams };
};