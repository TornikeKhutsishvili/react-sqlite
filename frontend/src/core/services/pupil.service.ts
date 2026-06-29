import { BASE_URL, getHeaders } from "../api/api";
import type { IPupil } from "../interfaces/pupil.interfaces";

export const pupilService = {
  // აბრუნებს მოსწავლეების მასივს
  getAll: async (): Promise<IPupil[]> => {
    const res = await fetch(`${BASE_URL}/pupils`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Failed to fetch pupils");
    }

    return res.json();
  },

  // ამატებს ახალ მოსწავლეს
  create: async (pupilData: Partial<IPupil>): Promise<IPupil> => {
    const res = await fetch(`${BASE_URL}/pupils`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(pupilData),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Failed to create pupil");
    }

    return res.json();
  },
};
