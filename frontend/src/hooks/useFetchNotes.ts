/**
 * Custom hook для получения и управления заметками с пагинацией
 */

import { useState, useCallback, useEffect } from 'react';
import { PageResponse, Note, NoteRequest } from '../types';
import apiService from '../services/apiService';

interface UseFetchNotesReturn {
  data: PageResponse<Note>;
  loading: boolean;
  error: string | null;
  fetchNotes: (page: number) => Promise<void>;
  createNote: (note: NoteRequest) => Promise<void>;
  updateNote: (id: number, note: NoteRequest) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
}

export const useFetchNotes = (): UseFetchNotesReturn => {
  const [data, setData] = useState<PageResponse<Note>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 12,
    first: true,
    last: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPaginated<Note>(
        '/notes',
        page,
        12,
        'createdAt,desc'
      );
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setData({
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 12,
        first: true,
        last: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(
    async (note: NoteRequest) => {
      try {
        setError(null);
        await apiService.create('/notes', note);
        await fetchNotes(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create note');
        throw err;
      }
    },
    [fetchNotes]
  );

  const updateNote = useCallback(
    async (id: number, note: NoteRequest) => {
      try {
        setError(null);
        await apiService.update('/notes', id, note);
        await fetchNotes(data.number);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update note');
        throw err;
      }
    },
    [fetchNotes, data.number]
  );

  const deleteNote = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await apiService.delete('/notes', id);
        await fetchNotes(data.number);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete note');
        throw err;
      }
    },
    [fetchNotes, data.number]
  );

  useEffect(() => {
    fetchNotes(0);
  }, [fetchNotes]);

  // Backwards-compatible fields used by CalendarPage (notes, refetch)
  const notes = data.content;
  const refetch = async () => fetchNotes(data.number);

  return {
    data,
    notes,
    loading,
    error,
    fetchNotes,
    refetch,
    createNote,
    updateNote,
    deleteNote,
  } as unknown as UseFetchNotesReturn & { notes: Note[]; refetch: () => Promise<void> };
};
