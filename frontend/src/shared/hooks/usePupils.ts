/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import type { IPupil } from '../../core/interfaces/pupil.interfaces';
import { pupilService } from '../../core/services/pupil.service';

export const usePupils = () => {
  const [pupils, setPupils] = useState<IPupil[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPupils = async () => {
    try {
      setLoading(true);
      const data = await pupilService.getAll();
      setPupils(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addPupil = async (pupilData: Partial<IPupil>) => {
    try {
      const newPupil = await pupilService.create(pupilData);
      setPupils((prev) => [...prev, newPupil]);
    } catch (err: any) {
      setError(err.message || 'Failed to add pupil');
    }
  };

  useEffect(() => {
    fetchPupils()
  }, []);

  return { pupils, loading, error, addPupil, refetch: fetchPupils };
};
