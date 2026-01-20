/**
 * Custom hook для получения и управления заметками
 */

import { useState, useEffect } from 'react';
import { notesApi } from '../services/api';
import type { Note } from '../types';

interface UseFetchNotesReturn {
  notes: Note[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchNotes = (): UseFetchNotesReturn => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notesApi.getAll();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    loading,
    error,
    refetch: fetchNotes,
  };
};
